package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.LoginRequest;
import com.nipapager.eventticketingplatform.user.dto.LoginResponse;
import com.nipapager.eventticketingplatform.user.dto.RegistrationRequest;

/**
 * Service interface for authentication operations
 */
public interface AuthService {

    Response<LoginResponse> register(RegistrationRequest request);

    Response<LoginResponse> login(LoginRequest request);
}