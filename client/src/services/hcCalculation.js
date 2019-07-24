import { getAssignmentPage, getClassPage } from './minervaApi.js';

export const calculatePerformance = (token, performance, hcHashtag) => {
  // TODO:
  // first year HC should not count toward transfer score if:
  // the category of the HC graded is in the same as the class

  if (performance['type'] === "assignment") {
    return getAssignmentPage(token, performance['assignment']['id']).then((assignmentPage) => {
      // find out if the hc is foregrounded
      let foregrounded = false;
      assignmentPage['focused-outcomes'].forEach(outcome => {
        if (outcome['hc-item'] && outcome['hc-item']['hashtag'] === hcHashtag) {
          foregrounded = true;
        }
      });

      // return only useful performance data
      return {
        'type': performance['type'],
        'score': performance['score'],
        'weight': assignmentPage['weight'],
        'foregrounded': foregrounded
      };
    });
  }
  else if (performance['type'] === "poll" || performance['type'] === "video" || performance['type'] === "general") {
    return getClassPage(token, performance['class']['id'], hcHashtag).then((classPage) => {
      // find out if the hc is foregrounded
      let foregrounded = false;
      classPage['assessment']['focused-outcomes'].forEach(outcome => {
        if (outcome['hc-item'] && outcome['hc-item']['hashtag'] === hcHashtag) {
          foregrounded = true;
        }
      });

      // return only useful performance data
      return {
        'type': performance['type'],
        'score': performance['score'],
        'weight': 1,
        'foregrounded': foregrounded
      };
    });
  }
  else {
    return null;
  }
};
