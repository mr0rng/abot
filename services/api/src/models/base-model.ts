import DAO from '@abot/dao';

export default class BaseModel {
  protected dao: DAO;

  constructor(dao: DAO) {
    this.dao = dao;
  }
}
