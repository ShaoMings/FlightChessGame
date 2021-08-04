package com.game.utils;

import org.springframework.util.StringUtils;

import javax.servlet.http.HttpSession;
import java.util.*;

/**
 * @author shaoming
 *  session处理工具类
 */
public class OnlineSessionContext {
    /**
     * 静态的HashMap存储应用中登录后创建的有效的session.
     */
    private static final HashMap<String, HttpSession> ONLINE_SESSION_MAP = new HashMap<>();

    public static synchronized void addSession(HttpSession session){
        if (session!=null){
            ONLINE_SESSION_MAP.put(session.getId(), session);
        }
    }

    public static synchronized void deleteSession(HttpSession session){
        if (session!=null){
            ONLINE_SESSION_MAP.remove(session.getId());
        }
    }

    public static synchronized HttpSession getSession(String sessionId){
        if (StringUtils.hasText(sessionId)){
            return ONLINE_SESSION_MAP.get(sessionId);
        }
        return null;
    }

    public static synchronized int getOnlineSessionCount(){
        int counter = 0;
        for (Map.Entry<String, HttpSession> stringHttpSessionEntry : ONLINE_SESSION_MAP.entrySet()) {
            HttpSession session = stringHttpSessionEntry.getValue();
            if (session.getId() != null) {
                String user = (String) session.getAttribute("user");
                if (StringUtils.hasText(user)) {
                    counter++;
                }
            }
        }
        return counter;
    }

    public static synchronized List<String> getOnlineSessionsUserName(HttpSession session){
        if (getOnlineSessionCount()>0) {
            String myself = (String) session.getAttribute("user");
            List<String> list = new ArrayList<>();
            for (Map.Entry<String, HttpSession> stringHttpSessionEntry : ONLINE_SESSION_MAP.entrySet()) {
                HttpSession mySession = stringHttpSessionEntry.getValue();
                if (mySession.getId() != null) {
                    String user = (String) mySession.getAttribute("user");
                    if (StringUtils.hasText(user)) {
                        if (StringUtils.hasText(myself) && !user.equals(myself)) {
                            String status = (String) mySession.getAttribute("status");
                            String username = (String) mySession.getAttribute("username");
                            list.add(user + ":" + username + ":" + status);
                        }
                    }
                }
            }
            return list;
        }
            return null;
    }
}
