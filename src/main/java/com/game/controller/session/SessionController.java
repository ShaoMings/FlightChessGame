package com.game.controller.session;

import com.game.utils.OnlineSessionContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * @author shaoming
 */
@RestController
@RequestMapping("/session")
public class SessionController {
    @GetMapping("/users")
    public List<String> getOnlineUsers(HttpSession session){
        return OnlineSessionContext.getOnlineSessionsUserName(session);
    }
}
