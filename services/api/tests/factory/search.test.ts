import { processQuery } from "../../src/factory/search"

test("processQuery", () => {
  const params = [];
  
  expect(processQuery("id", params, 'aasd ss wqq xdsdssd1 wqq'))
    .toStrictEqual([ "id ILIKE $1", "id ILIKE $2", "id ILIKE $3" ]);
  expect(params).toStrictEqual([ '%aasd%',  '%wqq%', '%xdsdssd1%' ]);
})