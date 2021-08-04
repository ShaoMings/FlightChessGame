package com.game.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.game.pojo.User;

/**
 * @author shaoming
 */
public interface UserService extends IService<User> {
        User getByUserId(String userName);
}
