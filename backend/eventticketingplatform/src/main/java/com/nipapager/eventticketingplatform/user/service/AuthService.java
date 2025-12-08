package com.nipapager.eventticketingplatform.user.service;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.user.dto.LoginRequest;
import com.nipapager.eventticketingplatform.user.dto.LoginResponse;
import com.nipapager.eventticketingplatform.user.dto.RegistrationRequest;

public interface AuthService {

    Response<?> register(RegistrationRequest registrationRequest);
    Response<LoginResponse> login(LoginRequest loginRequest);
}
