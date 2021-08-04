package com.game.listener;

import com.game.utils.OnlineSessionContext;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.ServletContext;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.*;
import java.util.HashSet;

/**
 * @author shaoming
 */
@WebListener
@SuppressWarnings("all")
@Slf4j
public class SessionListener implements HttpSessionListener, HttpSessionAttributeListener , ServletRequestListener {


    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext servletContext = session.getServletContext();
        HashSet<HttpSession> sessions = (HashSet<HttpSession>) servletContext.getAttribute("sessions");
        if (sessions==null){
            sessions = new HashSet<>();
            servletContext.setAttribute("sessions",sessions);
        }
        //放入servletContext 的session集合 sessions.size()获取当前活动的session数，即为“在线人数”
            sessions.add(session);
            //session放到工具类的集合中
            OnlineSessionContext.addSession(se.getSession());
            log.info("添加成功!");
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        ServletContext servletContext = session.getServletContext();
        HashSet<?> sessions = (HashSet<?>) servletContext.getAttribute("sessions");
        if (session.getId()!=null) {
            sessions.remove(session);
            //从工具类的静态集合中删除
            log.info("删除成功!");
        }else {
            System.out.println("删除失败!");
        }
        OnlineSessionContext.deleteSession(session);
    }

    /**
     * 一开始httpsession为空  初始化
     * @param sre ServletRequestEvent
     */
    @Override
    public void requestInitialized(ServletRequestEvent sre) {
        ((HttpServletRequest)sre.getServletRequest()).getSession();

    }
}
