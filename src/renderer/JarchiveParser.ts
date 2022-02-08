import { parse } from 'node-html-parser';

const parseRound = (clueRoot, responseRoot) => {
  const categories: Array<string> = clueRoot.querySelectorAll('td.category_name').map(c => c.rawText);
  const clues = clueRoot.querySelectorAll('td.clue');

  let result: Object<string, object> = {};
  categories.forEach(category => {
    result[category] = [];
  })

  const responses = responseRoot.querySelectorAll('td.clue').map(response =>
    response.querySelector('.correct_response')?.rawText || 'UNKNOWN'
  );

  clues.forEach((clue, i: number) => {
    const col = Math.floor(i%6);
    const category = categories[col];
    let value = clue.querySelector('.clue_value');
    value = value ? Number(value.rawText.slice(1)) : 'DAILY_DOUBLE';

    result[category] = [
      ...result[category],
      {
        value,
        clue: clue.querySelector('.clue_text').rawText,
        response: responses[i],
      }
    ]
  })

  return result;
}

const parseFinalJeopardy = (clueRoot, responseRoot) => {
}

export default async (clueHtml, responseHtml) => {
  const responseRoot = await parse(responseHtml);
  const clueRoot = await parse(clueHtml);

  console.warn(
    responseRoot.querySelector('#jeopardy_round'),
    responseRoot.querySelector('#double_jeopardy_round'),
    responseRoot.querySelector('#final_jeopardy_round'),
  )

  const firstRound = parseRound(
    clueRoot.querySelector('#jeopardy_round'),
    responseRoot.querySelector('#jeopardy_round')
  );

  const secondRound = parseRound(
    clueRoot.querySelector('#double_jeopardy_round'),
    responseRoot.querySelector('#double_jeopardy_round')
  );

  const finalJeopardy = parseFinalJeopardy(
    clueRoot.querySelector('#final_jeopardy_round'),
    responseRoot.querySelector('#final_jeopardy_round'),
  );
  return {
    firstRound,
    secondRound,
    finalJeopardy,
  };
}
