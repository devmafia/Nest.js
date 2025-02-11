import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import { UserService } from './user.service';
import { DeleteUserDto, UserResponse } from '../dtos/user.dto';
import { UseGuards } from '@nestjs/common';
import { UpdateUsernameInput, UpdateEmailInput, UpdatePasswordInput } from '../dtos/user.dto';
import { UserRole } from 'src/types/types';
import { Role, RoleAuthGuard } from 'src/auth/roles.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.user, UserRole.admin)
  async getUserdata(@Args('userId', { type: () => Int }) userId: number): Promise<UserResponse> {
    const user = await this.userService.getUserById(userId);
    return user;
  }

  @Mutation(() => UserResponse)
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.user, UserRole.admin)
  async updateUsername(
    @Args('variables') variables: UpdateUsernameInput
  ): Promise<UserResponse> {
    const { id, username } = variables;
    return this.userService.updateUsername(id, username);
  }

  @Mutation(() => UserResponse)
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.user, UserRole.admin)
  async updateEmail(
    @Args('variables') variables: UpdateEmailInput
  ): Promise<UserResponse> {
    const { id, email } = variables;
    return this.userService.updateEmail(id, email);
  }

  @Mutation(() => Boolean)
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.user, UserRole.admin)
  async updatePassword(
    @Args('variables') variables: UpdatePasswordInput): Promise<boolean> {
    const { id, password } = variables;
    return this.userService.updatePassword(id, password);
  }

  @Mutation(() => Boolean)
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.user, UserRole.admin)
  async deleteUser(@Args('variables') variables: DeleteUserDto): Promise<boolean> {
    const { userId }= variables;
    return this.userService.deleteUser(userId);
  }
}
