module.exports.getDate = getDate;

function getDate() {
  const today = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  const day = today.toLocaleDateString('en-US', options);
  return day;
}

exports.getDay = function() {
  const today = new Date();

  const options = {
    weekday: 'long',
  }

  const day = today.toLocaleDateString('en-US', options);
  return day;
};

console.log(module.exports);