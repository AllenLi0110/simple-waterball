package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 這是一個簡單的 REST Controller，用於測試應用程式是否正常運行。
 */
@RestController // 標記這個類別是一個處理 HTTP 請求的 RESTful Controller
public class HelloWorldController {

    /**
     * 定義一個 GET 請求的端點，路徑為 /hello
     * 當使用者存取 http://localhost:8080/hello 時，將會執行這個方法
     * @return 返回一個簡單的字串訊息
     */
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, simple-waterball application is running successfully and connected to DB!";
    }
}