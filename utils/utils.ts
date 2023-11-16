import { ObjectId } from "mongodb";

export function parseLowerCase(str: String) {
  return str.toLowerCase();
}
export const MAX_NUMBER_OF_REGISTRATIONS = 7; // 1 team

export function generatePlayerListPipeline(gameId: string) {
  return [
    {
      $match: {
        _id: new ObjectId(gameId),
      },
    },
    {
      $lookup: {
        from: "users",
        let: {
          participants: "$participants",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$username", "$$participants"],
              },
            },
          },
          {
            $addFields: {
              repetitions: {
                $size: {
                  $filter: {
                    input: "$$participants",
                    cond: {
                      $eq: ["$$this", "$username"],
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              roles: 0,
              password: 0,
              games: 0,
              dateJoined: 0,
              __v: 0,
            },
          },
        ],
        as: "participants",
      },
    },
    {
      $unwind: "$participants",
    },
    {
      $replaceRoot: {
        newRoot: "$participants",
      },
    },
  ];
}

export const PLAYER_LIST_DATA_HEADERS = [
  "Username",
  "Project",
  "Location",
  "Twitter",
  "Telegram",
  "Repetitions",
];
