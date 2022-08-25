import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      where: { id: user_id },
      relations: ["games"]
    });

    if (user !== undefined) {
      return user;
    }

    return new User();
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      select *
      from users u
      order by u.first_name ASC
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      select u.*
      from users u
      where
        u.first_name ilike $1
        and u.last_name ilike $2
    `, [first_name, last_name]);
  }
}
