package com.game.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author shaoming
 */
public class LoginInterceptor implements HandlerInterceptor {
    public static final String ADMIN_PATH = "/admin/index";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object user = request.getSession().getAttribute("user");
        if (user != null) {
            Boolean isAdmin = (Boolean) request.getSession().getAttribute("isAdmin");
            if (ADMIN_PATH.equals(request.getServletPath())){
                if (isAdmin){
                    return true;
                }else {
                    return false;
                }
            }else {
                return true;
            }
        } else {
            request.getRequestDispatcher("/login").forward(request, response);
            return false;
        }
    }
}
