# 天气模块AIDL协议定义

## 一、AIDL接口定义

### IWeatherService.aidl
```aidl
package com.example.weather;

import com.example.weather.WeatherData;
import com.example.weather.IWeatherCallback;

interface IWeatherService {
    // 获取天气数据
    WeatherData getWeather(String cityCode);
    
    // 订阅天气更新
    void subscribeWeatherUpdates(String cityCode, IWeatherCallback callback);
    
    // 取消订阅
    void unsubscribeWeatherUpdates(IWeatherCallback callback);
    
    // 获取支持的城市列表
    List<String> getSupportedCities();
}
```

### IWeatherCallback.aidl
```aidl
package com.example.weather;

import com.example.weather.WeatherData;

interface IWeatherCallback {
    // 天气数据更新回调
    void onWeatherUpdated(WeatherData data);
    
    // 错误回调
    void onError(int errorCode, String message);
}
```

### WeatherData.aidl
```aidl
package com.example.weather;

parcelable WeatherData {
    String cityCode;        // 城市编码（如 beijing）
    String cityName;       // 城市名称
    float temperature;     // 温度（摄氏度）
    float humidity;        // 湿度（百分比）
    String weatherType;    // 天气类型（sunny, cloudy, rainy等）
    long timestamp;        // 更新时间戳
    int dataSource;        // 数据来源（1=网络, 2=缓存）
}
```

---

## 二、错误码定义

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 1001 | 网络请求失败 |
| 1002 | 城市编码无效 |
| 1003 | 数据解析失败 |
| 1004 | 服务未连接 |
| 1005 | 订阅已存在 |

---

## 三、调用示例

### 获取天气数据
```kotlin
// 连接服务
val serviceIntent = Intent("com.example.weather.WeatherService")
serviceIntent.setPackage("com.example.weather")
bindService(serviceIntent, serviceConnection, Context.BIND_AUTO_CREATE)

// 调用接口
private var weatherService: IWeatherService? = null

fun getWeather(cityCode: String): Result<WeatherData> {
    return try {
        weatherService?.let { service ->
            val data = service.getWeather(cityCode)
            Result.success(data)
        } ?: Result.failure(ServiceException("服务未连接"))
    } catch (e: RemoteException) {
        Result.failure(e)
    }
}

// 带超时和重试
suspend fun getWeatherWithRetry(cityCode: String): Result<WeatherData> = withTimeout(5000) {
    repeat(2) { attempt ->
        try {
            weatherService?.getWeather(cityCode)?.let { 
                return Result.success(it)
            }
        } catch (e: RemoteException) {
            if (attempt == 1) return Result.failure(e)
            delay(1000) // 重试间隔
        }
    }
    Result.failure(ServiceException("获取失败"))
}
```

### 订阅天气更新
```kotlin
private val callback = object : IWeatherCallback.Stub() {
    override fun onWeatherUpdated(data: WeatherData) {
        // 处理天气更新
        _weatherData.postValue(data)
    }
    
    override fun onError(errorCode: Int, message: String) {
        // 处理错误
        Timber.e("Weather error: $errorCode - $message")
    }
}

fun subscribe(cityCode: String) {
    weatherService?.subscribeWeatherUpdates(cityCode, callback)
}
```

---

## 四、服务端实现要点

### 服务端Service
```kotlin
class WeatherService : Service() {
    private val binder = IWeatherService.Stub()
    private val callbacks = mutableMapOf<String, MutableList<IWeatherCallback>>()
    
    override fun onBind(intent: Intent?): IBinder = binder
    
    inner class Stub : IWeatherService.Stub() {
        override fun getWeather(cityCode: String): WeatherData {
            // 实现：从Repository获取数据
            // 注意：Binder调用在Binder线程池，不是主线程
        }
        
        override fun subscribeWeatherUpdates(cityCode: String, callback: IWeatherCallback) {
            // 注册回调
            synchronized(callbacks) {
                callbacks.getOrPut(cityCode) { mutableListOf() }.add(callback)
            }
        }
    }
}
```

---

## 五、数据缓存策略

| 缓存类型 | 时长 | 存储位置 |
|---------|------|---------|
| 内存缓存 | 10分钟 | LruCache (maxSize=50) |
| 磁盘缓存 | 1小时 | SharedPreferences / DiskLruCache |

**缓存判断逻辑**：
```kotlin
fun getCachedWeather(cityCode: String): WeatherData? {
    // 1. 检查内存缓存
    memoryCache.get(cityCode)?.let { 
        if (!isExpired(it, 10 * 60 * 1000)) return it
    }
    
    // 2. 检查磁盘缓存
    diskCache.get(cityCode)?.let {
        if (!isExpired(it, 60 * 60 * 1000)) {
            memoryCache.put(cityCode, it)  // 回填内存缓存
            return it
        }
    }
    
    return null
}

private fun isExpired(data: WeatherData, maxAgeMs: Long): Boolean {
    return System.currentTimeMillis() - data.timestamp > maxAgeMs
}
```

---

## 六、城市编码映射

| 城市编码 | 城市名称 | API参数 |
|---------|---------|--------|
| beijing | 北京 | Beijing |
| shanghai | 上海 | Shanghai |
| guangzhou | 广州 | Guangzhou |
| shenzhen | 深圳 | Shenzhen |
| hangzhou | 杭州 | Hangzhou |

**使用原则**：
- 内部传递使用城市编码（英文）
- 显示使用城市名称（中文）
- API调用根据第三方API要求转换