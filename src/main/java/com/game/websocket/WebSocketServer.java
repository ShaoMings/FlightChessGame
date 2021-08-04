package com.game.websocket;

import cn.hutool.log.Log;
import cn.hutool.log.LogFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.game.config.GetHttpSessionConfigurator;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author shaoming
 */
@ServerEndpoint(value = "/ws/{userId}/{status}", configurator = GetHttpSessionConfigurator.class)
@Component
@Scope("prototype")
public class WebSocketServer {
    /**
     * 获取本类日志
     */
    static Log log = LogFactory.get(WebSocketServer.class);
    /**
     * 在线人数
     */
    private static int onlineCount = 0;
    /**
     * 存放用户websocket连接的map  key 用户名 value WebSocketServer
     */
    private static ConcurrentHashMap<String, WebSocketServer> webSocketMap = new ConcurrentHashMap<>();
    /**
     * 存放正在对战的玩家集合
     */
    private static List<ArrayList<WebSocketServer>> fightingOnlinePlayers = new ArrayList<>();
    private Session session;
    private String userId = "";
    /**
     * 一个用户的会话
     */
    HttpSession httpSession;

    private static final String STATUS_ONLINE = "online";
    private static final String STATUS_GAME= "game";

//    HttpServletRequest request;

    /**
     * WebSocket建立连接成功时调用的方法
     *
     * @param session 与某个客户端的连接会话，要通过它来给客户端发送数据
     * @param userId  当前建立ws连接的id
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId,@PathParam("status") String status, EndpointConfig config) {
        httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        this.session = session;
        this.userId = userId;
        if (STATUS_ONLINE.equals(status)){
            httpSession.setAttribute("status", "在线");
        }else if (STATUS_GAME.equals(status)){
            httpSession.setAttribute("status","游戏中");
        }

        if (webSocketMap.containsKey(userId)) {
            webSocketMap.remove(userId);
            webSocketMap.put(userId, this);
        } else {
            webSocketMap.put(userId, this);
            addOnlineCount();
        }

        log.info(userId + "连接成功！当前在线人数为：" + getOnlineCount());

        try {
            sendMessage("连接成功！");
        } catch (IOException e) {
            log.info("用户" + userId + "连接异常!");
        }
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     * @param session 会话对象
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("接收来自" + this.userId + "的信息:" + message);
        if (StringUtils.hasText(message)) {
            try {
                JSONObject jsonObject = JSON.parseObject(message);
                //将当前用户id保存
                jsonObject.put("sourceUser", this.userId);
                //获取目标id
                String targetUser = jsonObject.getString("targetUser");
                if (StringUtils.hasText(targetUser) && webSocketMap.containsKey(targetUser)) {
                    //绑定目标id并向其发送信息
                    webSocketMap.get(targetUser).sendMessage(jsonObject.getString("contentText"));
                } else {
                    //否则不在这个服务器上，发送到mysql或者redis
                    log.info("用户" + targetUser + "不在线，无法发送信息!");
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * ws连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        if (webSocketMap.containsKey(this.userId)) {
            log.info("用户" + this.userId + "下线了！");
            httpSession.setAttribute("status","离线");
            webSocketMap.remove(this.userId);
            subOnlineCount();
        }
    }

    /**
     * ws连接出现错误调用的方法
     *
     * @param session 会话对象
     * @param error   发生的错误对象
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("用户" + this.userId + ",发生错误,错误原因:" + error.getMessage());
        error.printStackTrace();
    }

    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    public static void sendInformationActively(String message, @PathParam("userId") String userId) throws IOException {
        log.info("用户" + userId + "发送信息:" + message + "到服务器!");
        if (StringUtils.hasText(message) && webSocketMap.containsKey(userId)) {
            webSocketMap.get(userId).sendMessage(message);
        } else {
            log.error("用户" + userId + "不在线!");
        }
    }

    /**
     * 获取当前在线用户的WebSocketServer集合
     *
     * @return WebSocketServer集合
     */
    public static synchronized Map<String, WebSocketServer> getWebSocketMap() {
        return webSocketMap;
    }


    /**
     * 获取当前在线用户数量
     *
     * @return 当前在线用户数量
     */
    public static synchronized int getOnlineCount() {
        return WebSocketServer.onlineCount;
    }

    /**
     * 用户数量加1
     */
    public static synchronized void addOnlineCount() {
        WebSocketServer.onlineCount++;
    }

    /**
     * 用户数量减1
     */
    public static synchronized void subOnlineCount() {
        WebSocketServer.onlineCount--;
    }

}
