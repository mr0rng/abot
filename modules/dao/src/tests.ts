import DAO from '.';

export default class TestsDAO extends DAO {
  async clear () {
    await this.execute(
      [
        "DELETE FROM "
      ].join('\n')
    )
  }
}