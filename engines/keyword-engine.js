module.exports = async function(keyword){

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

let results = [];

letters.forEach(letter => {

results.push(keyword + " " + letter);

});

return results;

}