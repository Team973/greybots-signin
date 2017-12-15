function addZero(i) {
  let zero = i;
  if (i < 10) {
    zero = `0${i}`;
  }
  return zero;
}

function addOne(i) {
  const one = 1 + i;
  return one;
}

function twelveHour(i) {
  let twelve = i;
  if (i > 12) {
    twelve -= 12;
  } else if (i === 0) {
    twelve = 12;
  }
  return twelve;
}

function time() {
  const now = new Date();
  const currentTime = `${twelveHour(now.getHours())}:${addZero(now.getMinutes())}`;
  return currentTime;
}

function date() {
  const now = new Date();
  const currentDate = `${addOne(now.getMonth())}-${now.getDate()}`;
  return currentDate;
}

module.exports = {
  time,
  date,
};
