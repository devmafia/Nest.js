import { Injectable, UnauthorizedException, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../types/types';
import { SetMetadata } from '@nestjs/common';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const token = this.extractToken(req.headers);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.determineSecret(req);
      const decoded: any = jwt.verify(token, secret);
      req.user = decoded;

      const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
      if (requiredRoles && !requiredRoles.includes(decoded.role)) {
        throw new UnauthorizedException('Access denied');
      }

      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(headers: any): string | null {
    const authHeader = headers?.authorization || headers?.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  private determineSecret(req: any): string {
    const decodedToken = jwt.decode(this.extractToken(req.headers));
    if (decodedToken && decodedToken['role'] === UserRole.admin) {
      return this.configService.get<string>('ADMIN_SECRET_KEY');
    }
    return this.configService.get<string>('JWT_SECRET');
  }
}

export const ROLES_KEY = 'roles';
export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
