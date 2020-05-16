

export const getOverallScore = (hsItems) => {
  var overallScore = {};
  if (hsItems == null) {
    return overallScore;
  }

  ['CS', 'EA', 'FA', 'MC'].forEach((key) => {
    const HCs = hsItems[key];
    var hcScore = 0;
    var transferScope = 0;
    var transferCompetence = 0;
    HCs.forEach((HC) => {
      hcScore += HC.mean;
      transferScope += (HC['transfer-score'] >= 3) ? 1 : 0;
      transferCompetence += HC['transfer-score'];
    });
    hcScore /= HCs.length;
    transferScope = Math.min(1+23.5*transferScope/HCs.length/4, 5);
    transferCompetence /= HCs.length;
    const composite = 0.6*hcScore + 0.25*transferScope + 0.15*transferCompetence;

    overallScore[key] = {
      'hcScore': hcScore,
      'transferScope': transferScope,
      'transferCompetence': transferCompetence,
      'composite': composite,
      'letterGrade': composite>=4 ? 'A+' : (composite>=3.55 ? 'A' : (composite>=3.35 ? 'A-' : (composite>=3.15 ? 'B+' : (composite>=2.95 ? 'B' : (composite>=2.75 ? 'B-' : (composite>2.6 ? 'C+' : (composite>=2.5 ? 'C' : (composite>=2.25 ? 'C-' : (composite>=2 ? 'D' : 'F')))))))))
    };

  });
  return overallScore;
}
