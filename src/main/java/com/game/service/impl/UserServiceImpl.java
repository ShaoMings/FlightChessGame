package com.game.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.game.dao.UserMapper;
import com.game.pojo.User;
import com.game.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * @author shaoming
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User getByUserId(String userName) {
        if (StringUtils.hasText(userName)){
            LambdaQueryWrapper<User> lambdaQueryWrapper = new LambdaQueryWrapper<>();
            lambdaQueryWrapper.eq(User::getUserId,userName);
            List<User> list = list(lambdaQueryWrapper);
            if (!CollectionUtils.isEmpty(list)){
                return list.get(0);
            }
        }
        return null;
    }
}
