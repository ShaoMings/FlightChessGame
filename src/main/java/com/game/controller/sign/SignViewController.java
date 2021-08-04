package com.game.controller.sign;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author shaoming
 */
@Controller
public class SignViewController {
    @RequestMapping("/login")
    public String login(HttpServletRequest request){
        HttpSession session = request.getSession();
        if (session.getAttribute("auth")==null) {
            session.setAttribute("auth", false);
        }
        return "sign";
    }
}
