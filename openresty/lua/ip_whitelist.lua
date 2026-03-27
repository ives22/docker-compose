-- Redis 相关配置
local redis_host = "192.168.60.155"
local redis_port = 6379
local redis_password = ""
local redis_key_white_list = "devops:ip_allowlist"

-- 获取客户端 IP
local client_ip = ngx.var.remote_addr

-- 引入模块
local redis = require "resty.redis"
local bit = require "bit"

-- ============ IP 转换工具函数 ============

-- IP 转数字
local function ip_to_number(ip)
    local a, b, c, d = ip:match("(%d+)%.(%d+)%.(%d+)%.(%d+)")
    if not a then return nil end
    return bit.lshift(tonumber(a), 24) + bit.lshift(tonumber(b), 16) +
            bit.lshift(tonumber(c), 8) + tonumber(d)
end

-- 解析 CIDR，返回网络地址数字和掩码
local function parse_cidr(cidr)
    local network, mask_str = cidr:match("(%d+%.%d+%.%d+%.%d+)/(%d+)")
    if not network then
        return nil  -- 不是 CIDR 格式
    end

    local mask = tonumber(mask_str)
    local network_num = ip_to_number(network)

    if not network_num then return nil end

    -- 创建掩码
    local mask_num = bit.lshift(0xFFFFFFFF, 32 - mask)
    local network_masked = bit.band(network_num, mask_num)

    return {
        network = network_masked,
        mask = mask_num,
        original = cidr
    }
end

-- 检查 IP 是否匹配 CIDR 规则
local function match_cidr(ip_num, cidr_rule)
    return bit.band(ip_num, cidr_rule.mask) == cidr_rule.network
end

-- ============ Redis 连接管理 ============

local function connect_redis()
    local red = redis:new()
    red:set_timeout(1000)

    local ok, err = red:connect(redis_host, redis_port)
    if not ok then
        ngx.log(ngx.ERR, "Failed to connect to Redis: ", err)
        return nil
    end

    if redis_password and redis_password ~= "" then
        local auth_ok, auth_err = red:auth(redis_password)
        if not auth_ok then
            ngx.log(ngx.ERR, "Failed to authenticate with Redis: ", auth_err)
            red:close()
            return nil
        end
    end

    return red
end

-- ============ 白名单数据加载 ============

-- 每次请求都实时从 Redis 读取最新数据
local function load_whitelist_rules()
    local red = connect_redis()
    if not red then
        ngx.log(ngx.ERR, "Redis connection failed")
        return nil
    end

    -- 直接从原始白名单加载
    local members, err = red:smembers(redis_key_white_list)
    if err then
        ngx.log(ngx.ERR, "Failed to query whitelist: ", err)
        red:close()
        return nil
    end

    -- 编译规则
    local single_ips = {}
    local cidr_rules = {}

    for _, member in ipairs(members) do
        local cidr_rule = parse_cidr(member)
        if cidr_rule then
            table.insert(cidr_rules, cidr_rule)
        else
            -- 单个 IP，转为数字存储
            local ip_num = ip_to_number(member)
            if ip_num then
                table.insert(single_ips, ip_num)
            end
        end
    end

    red:close()

    ngx.log(ngx.DEBUG, "Loaded ", #single_ips + #cidr_rules,
            " whitelist rules (", #single_ips, " single IPs, ",
            #cidr_rules, " CIDR ranges)")

    return {
        single_ips = single_ips,
        cidr_rules = cidr_rules
    }
end

-- ============ IP 匹配核心逻辑 ============

-- 二分查找优化：在有序数组中查找 IP
local function binary_search_ip(sorted_ips, ip_num)
    local left, right = 1, #sorted_ips
    while left <= right do
        local mid = bit.rshift(left + right, 1)
        if sorted_ips[mid] == ip_num then
            return true
        elseif sorted_ips[mid] < ip_num then
            left = mid + 1
        else
            right = mid - 1
        end
    end
    return false
end

-- 检查 IP 是否在白名单中
local function is_ip_allowed(ip)
    -- 加载规则（每次都从 Redis 获取最新数据）
    local rules = load_whitelist_rules()
    if not rules then
        ngx.log(ngx.ERR, "No whitelist rules available")
        return false
    end

    local ip_num = ip_to_number(ip)
    if not ip_num then
        ngx.log(ngx.WARN, "Invalid IP format: ", ip)
        return false
    end

    -- 3. 快速匹配：单个 IP（使用二分查找）
    table.sort(rules.single_ips)

    if binary_search_ip(rules.single_ips, ip_num) then
        ngx.log(ngx.INFO, "Access granted for IP (single match): ", ip)
        return true
    end

    -- 4. 匹配 CIDR 规则
    for _, cidr_rule in ipairs(rules.cidr_rules) do
        if match_cidr(ip_num, cidr_rule) then
            ngx.log(ngx.INFO, "Access granted for IP (CIDR match): ", ip,
                    " rule: ", cidr_rule.original)
            return true
        end
    end

    -- 5. 未匹配
    ngx.log(ngx.WARN, "Access denied for IP: ", ip)
    return false
end

-- ============ 主逻辑 ============

if is_ip_allowed(client_ip) then
    ngx.log(ngx.INFO, "Access granted for IP: ", client_ip)
else
    ngx.log(ngx.WARN, "Access denied for IP: ", client_ip)
    ngx.status = ngx.HTTP_FORBIDDEN
    ngx.header.content_type = "application/json"
    ngx.say('{"error": "Forbidden", "message": "Your IP is not allowed"}')
    ngx.exit(ngx.HTTP_FORBIDDEN)
end