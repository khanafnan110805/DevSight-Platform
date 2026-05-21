export const CONTRIBUTIONS_QUERY = `
  query ContributionsQuery($username: String!) {
    user(login: $username) {
      login
      name
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions
      }
      repositories {
        totalCount
      }
    }
  }
`;
