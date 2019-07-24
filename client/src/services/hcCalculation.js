import { getAssignmentPage, getClassPage } from './minervaApi.js';

const cornerstoneCourses = ["AH50", "AH51", "CS50", "CS51", "SS50", "SS51", "NS50", "NS51"];

export const calculatePerformance = (token, performance, hcHashtag, hcCornerstoneCode, sections) => {
  // TODO:
  // first year HC should not count toward transfer score if:
  // the category of the HC graded is in the same as the class

  if (performance['type'] === "assignment") {
    return getAssignmentPage(token, performance['assignment']['id']).then((assignmentPage) => {
      // find out if the hc is foregrounded
      let foregrounded = false;
      if (cornerstoneCourses.includes(sections[assignmentPage['section-id']]['code'])) {
        if (sections[assignmentPage['section-id']]['code'].substring(0, 2) === "AH" && hcCornerstoneCode === "MC") {
          foregrounded = true;
        }
        else if (sections[assignmentPage['section-id']]['code'].substring(0, 2) === "CS" && hcCornerstoneCode === "FA") {
          foregrounded = true;
        }
        else if (sections[assignmentPage['section-id']]['code'].substring(0, 2) === "SS" && hcCornerstoneCode === "CS") {
          foregrounded = true;
        }
        else if (sections[assignmentPage['section-id']]['code'].substring(0, 2) === "NS" && hcCornerstoneCode === "EA") {
          foregrounded = true;
        }
      }
      else {
        assignmentPage['focused-outcomes'].forEach(outcome => {
          if (outcome['hc-item'] && outcome['hc-item']['hashtag'] === hcHashtag) {
            foregrounded = true;
          }
        });
      }

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
      if (cornerstoneCourses.includes(sections[classPage['section-id']]['code'])) {
        if (sections[classPage['section-id']]['code'].substring(0, 2) === "AH" && hcCornerstoneCode === "MC") {
          foregrounded = true;
        }
        else if (sections[classPage['section-id']]['code'].substring(0, 2) === "CS" && hcCornerstoneCode === "FA") {
          foregrounded = true;
        }
        else if (sections[classPage['section-id']]['code'].substring(0, 2) === "SS" && hcCornerstoneCode === "CS") {
          foregrounded = true;
        }
        else if (sections[classPage['section-id']]['code'].substring(0, 2) === "NS" && hcCornerstoneCode === "EA") {
          foregrounded = true;
        }
      }
      else {
        classPage['assessment']['focused-outcomes'].forEach(outcome => {
          if (outcome['hc-item'] && outcome['hc-item']['hashtag'] === hcHashtag) {
            foregrounded = true;
          }
        });
      }

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
