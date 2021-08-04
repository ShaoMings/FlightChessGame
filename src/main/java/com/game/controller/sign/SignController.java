package com.game.controller.sign;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.game.pojo.User;
import com.game.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * /sign/** 为放行请求路径  注意方法的实现！！！
 * @author shaoming
 */
@Controller
@RequestMapping("/sign")
public class SignController {

    public static final String ADMIN = "超级管理员";

    @Resource
    private UserService userService;

    @ResponseBody
    @PostMapping("/login")
    public String doLogin(@RequestParam("username") String username, @RequestParam("password") String password,
                          HttpServletRequest request){
        User user = userService.getByUserId(username);
        boolean isExist;
        if (user!=null){
            isExist = user.getPassword().equals(password);
            if (isExist){
                String role = user.getRole();
                HttpSession session = request.getSession();
                session.setAttribute("user",username);
                session.setAttribute("username",user.getUsername());
                session.setAttribute("userGender",user.getGender());
                session.setAttribute("userRole",user.getRole());
                session.setAttribute("auth",true);
                session.setAttribute("status","在线");
                if (ADMIN.equals(role)){
                    session.setAttribute("isAdmin",true);
                }else {
                    session.setAttribute("isAdmin",false);
                }
                session.setMaxInactiveInterval(3600);
            }
        }else {
            isExist = false;
        }
        return isExist?"登录成功!":"账户密码有误!";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response){
        HttpSession session = request.getSession();
        Cookie[] cookies = request.getCookies();
        if (cookies.length>0) {
            for (Cookie cookie : cookies) {
                if (StringUtils.hasText(cookie.getName())) {
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                }
            }
        }
        session.invalidate();
        return "redirect:/login";
    }

    @ResponseBody
    @PostMapping("/register")
    public String register(@RequestParam("username") String username,@RequestParam("name") String name,@RequestParam("password") String password){
        if (StringUtils.hasText(username) && StringUtils.hasText(password)){
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id",username).last("limit 1");
            int count = userService.count(queryWrapper);
            boolean isAdded;
            if (count<=0) {
                isAdded = userService.save(new User(0, username, name, password, '男', "普通用户"));
            }else {
                isAdded = false;
            }
            return isAdded?"注册成功!":"该用户名已被注册!";
        }else {
            return "注册失败";
        }
    }
}
