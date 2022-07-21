import { parse } from 'node-html-parser';

const htmlDecode = (input) => {
  var doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
};

const parseRound = (clueRoot, responseRoot, double) => {
  const categories: Array<string> = clueRoot
    .querySelectorAll('td.category_name')
    .map((c) => htmlDecode(c.rawText));
  const clues = clueRoot.querySelectorAll('td.clue');

  let result: Object<string, object> = {};
  categories.forEach((category) => {
    result[category] = [];
  });

  const responses = responseRoot
    .querySelectorAll('td.clue')
    .map(
      (response) =>
        htmlDecode(response.querySelector('.correct_response')?.rawText) ||
        'UNKNOWN'
    );

  clues.forEach((clue, i: number) => {
    const col = i % 6;
    const category = categories[col];
    let value = clue.querySelector('.clue_value');
    if (value) {
      value = Number(value.rawText.slice(1));
    }

    const rawClueText = clue.querySelector('.clue_text')?.rawText;
    const text = rawClueText && htmlDecode(rawClueText);
    const dailyDouble = !value && !!text;
    const mediaClue = clue.querySelector('.clue_text').querySelector('a');
    const mediaUrl = mediaClue && mediaClue.getAttribute('href');

    result[category] = [
      ...result[category],
      {
        id: i,
        value,
        text,
        response: responses[i],
        dailyDouble,
        completed: !text,
        mediaUrl,
      },
    ];
  });

  // Fix daily doubles
  Object.entries(result).forEach(([category, clues]) => {
    clues.forEach((clue, i) => {
      if (!clue.value) {
        const value = Object.values(result)
          .map((cs) => cs[i].value)
          .find((v) => v);
        result[category][i].value = value;
      }
    });
  });

  return result;
};

const parseFinalJeopardy = (clueRoot, responseRoot) => {
  const category = htmlDecode(clueRoot.querySelector('.category_name').rawText);
  const text = htmlDecode(clueRoot.querySelector('.clue_text').rawText);
  const response = htmlDecode(
    responseRoot.querySelector('em.correct_response').rawText
  );
  return { category, text, response };
};

export default async (clueHtml, responseHtml) => {
  const responseRoot = await parse(responseHtml);
  const clueRoot = await parse(clueHtml);

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
    responseRoot.querySelector('#final_jeopardy_round')
  );
  return {
    firstRound,
    secondRound,
    finalJeopardy,
  };
};
