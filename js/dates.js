class Dates {
  prettify(date) {
    let now = Date.now();
    let diff = date - now;
    let past = diff < 0;
    let diffInDays = Math.abs(Math.ceil(diff / (1000 * 3600 * 24)));
    let pastCaptions = {
      1: 'вчера',
      2: 'позавчера',
      14: 'неделю назад',
    };
    let futureCaptions = {
      1: 'завтра',
      2: 'послезавтра',
      3: 'через 2 дня',
      7: 'через неделю',
      14: 'через 2 недели',
    };
    let captions = (past) ? pastCaptions : futureCaptions;
    let prettyCaption = 'сегодня';

    if (diffInDays !== 0) {
      Object.keys(captions).map((key) => {
        if (diffInDays >= key) prettyCaption = captions[key];
      });
    }

    return prettyCaption;
  }
};

let dates = new Dates();
