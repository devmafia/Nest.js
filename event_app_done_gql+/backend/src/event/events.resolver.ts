import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from '../dtos/models.dtos';
import { UseGuards } from '@nestjs/common';
import { Role, RoleAuthGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/types/types';

@Resolver()
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event])
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Query(() => Event)
  async getEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.getEventById(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(RoleAuthGuard)
  @Role(UserRole.admin)
  async deleteEvent(@Args('id', { type: () => ID }) id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
