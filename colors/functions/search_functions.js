// find matching results from a list
function FindMatchesInList(filter, li, nunhits_max) {

    // Declare variables
    var a, i, txtValue;
    var numhits = 0;

    // if no entry
    if (filter == '' || filter == null){
        for (i = 0; i < li.length; i++) {
            li[i].style.display = "none";
        }            

    } else {
        // Loop through all list items, and hide those that don't match the search query
        for (i = 0; i < li.length; i++) {

            // max number of results to show
            if (numhits >= nunhits_max){
                li[i].style.display = "none";                
            } else {

                a = li[i].getElementsByTagName("a")[0];
                txtValue = a.textContent || a.innerText;

                // if at least 3 characters, search for all entries; if less search for start of the name
                if (filter.length <= 2) {
                    searchsucc = txtValue.toUpperCase().startsWith(filter);
                } else {
                    searchsucc = Boolean(txtValue.toUpperCase().indexOf(filter) > -1);
                }

                // if successful, display, otherwise hide
                if (searchsucc) {
                    li[i].style.display = "";
                    numhits ++;
                } else {
                    li[i].style.display = "none";
                }
            }
        }
    }
}


// find trigrams
TrigramIndex = function (inputPhrases) {
    function asTrigrams(phrase, callback) {
        var rawData = "  ".concat(phrase, "  ");
        for (var i = rawData.length - 3; i >= 0; i = i - 1)
            callback.call(this, rawData.slice(i, i + 3));
    };

    var instance = {
        phrases: [],
        trigramIndex: [],

        index: function (phrase) {
            if (!phrase || phrase === "" || this.phrases.indexOf(phrase) >= 0) return;
            var phraseIndex = this.phrases.push(phrase) - 1;
            asTrigrams.call(this, phrase, function (trigram) {
                var phrasesForTrigram = this.trigramIndex[trigram];
                if (!phrasesForTrigram) phrasesForTrigram = [];
                if (phrasesForTrigram.indexOf(phraseIndex) < 0) phrasesForTrigram.push(phraseIndex);
                this.trigramIndex[trigram] = phrasesForTrigram;
            });
        },

        find: function (phrase) {
            var phraseMatches = [];
            var trigramsInPhrase = 0;
            asTrigrams.call(this, phrase, function (trigram) {
                var phrasesForTrigram = this.trigramIndex[trigram];
                trigramsInPhrase += 1;
                if (phrasesForTrigram)
                    for (var j in phrasesForTrigram) {
                        phraseIndex = phrasesForTrigram[j];
                        if (!phraseMatches[phraseIndex]) phraseMatches[phraseIndex] = 0;
                        phraseMatches[phraseIndex] += 1;
                    }
            });
            var result = [];
            for (var i in phraseMatches)
                result.push({ phrase: this.phrases[i], matches: phraseMatches[i] });

            result.sort(function (a, b) {
                var diff = b.matches - a.matches;
                return diff;// == 0 ? a.phrase.localeCompare(b.phrase) : diff;
            });
            return result;
        }
    };

    for (var i in inputPhrases)
        instance.index(inputPhrases[i]);
    return instance;
};


// find most similar using trigrams
function FindMostSimUsingTrigram(input, li) {

    var t_score = 0;
    var t_ind = 0;

    if (input.length > 0){

        var trigram = TrigramIndex([input]);

        // get color name entries
        var a, i, txtValue, score_class, t_score, t_ind;        


        // compute similarity to each entry
        for (i = 0; i < li.length; i++) {

            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;

            // if entry the same, use that
            if (txtValue.toUpperCase() == input){
                t_score = 100;
                t_ind = i;

            } else {
                score_class = trigram.find(txtValue.toUpperCase())[0];
                
                // if there is output (overlaps)
                if (score_class != null) {
                    
                    // set preference for Artista colors where results are equal
                    if ((score_class.matches > t_score) || ((score_class.matches == t_score) && (txtValue.indexOf('Artista') > -1))) {
                        t_score = score_class.matches;
                        t_ind = i;
                    }
                }
            }
        }
    }

    return [t_ind, t_score]
}