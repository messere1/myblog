import request from './request'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResp {
  accessToken: string
}

export const loginApi = (data: LoginPayload) =>
  request.post<LoginResp, LoginResp>('/login', data)
