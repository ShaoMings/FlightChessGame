package com.game.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.game.pojo.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author shaoming
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
