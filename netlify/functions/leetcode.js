
// File: netlify/functions/leetcode.js

exports.handler = async function (event, context) {
  // Get the username from the request sent by your frontend
  const { username } = JSON.parse(event.body);

  const targetUrl = "https://leetcode.com/graphql/";

  const graphQlQuery = {
    query: `
      query userSessionProgress($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `,
    variables: { username: username },
  };

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQlQuery),
    });

    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    // Send the data back to your frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch data' }) };
  }
};
