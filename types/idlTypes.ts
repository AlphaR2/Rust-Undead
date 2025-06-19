/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/undead.json`.
 */
export type UndeadTypes = {
  address: "EZcvBzT1Vje7DxU8pi8YRwKsRzBv47v3q5cGmQUpPpNb";
  metadata: {
    name: "undead";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "battleWarriors";
      discriminator: [0, 180, 21, 137, 73, 157, 12, 26];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "warriorA";
          writable: true;
        },
        {
          name: "warriorB";
          writable: true;
        },
        {
          name: "profileA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 102, 105, 108, 101];
              },
              {
                kind: "account";
                path: "warrior_a.owner";
                account: "undeadWarrior";
              }
            ];
          };
        },
        {
          name: "profileB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 102, 105, 108, 101];
              },
              {
                kind: "account";
                path: "warrior_b.owner";
                account: "undeadWarrior";
              }
            ];
          };
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        }
      ];
      args: [];
    },
    {
      name: "createWarrior";
      discriminator: [163, 157, 34, 175, 170, 146, 80, 103];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "warrior";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [119, 97, 114, 114, 105, 111, 114];
              },
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "arg";
                path: "name";
              }
            ];
          };
        },
        {
          name: "userProfile";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 102, 105, 108, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "dna";
          type: "string";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "admin";
          type: "pubkey";
        }
      ];
    },
    {
      name: "pauseGame";
      discriminator: [133, 116, 165, 66, 173, 81, 10, 85];
      accounts: [
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "admin";
          signer: true;
        }
      ];
      args: [
        {
          name: "paused";
          type: "bool";
        }
      ];
    },
    {
      name: "updateAchievements";
      discriminator: [218, 177, 159, 24, 144, 26, 79, 60];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "achievements";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  97,
                  99,
                  104,
                  105,
                  101,
                  118,
                  101,
                  109,
                  101,
                  110,
                  116,
                  115
                ];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "userProfile";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 102, 105, 108, 101];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "gameConfig";
      discriminator: [45, 146, 146, 33, 170, 69, 96, 133];
    },
    {
      name: "undeadWarrior";
      discriminator: [221, 104, 254, 146, 1, 24, 0, 118];
    },
    {
      name: "userAchievements";
      discriminator: [113, 223, 157, 75, 204, 112, 2, 207];
    },
    {
      name: "userProfile";
      discriminator: [32, 37, 119, 205, 179, 180, 13, 194];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidName";
      msg: "Invalid warrior name";
    },
    {
      code: 6001;
      name: "invalidDna";
      msg: "DNA must be exactly 8 characters";
    },
    {
      code: 6002;
      name: "gamePaused";
      msg: "Game is currently paused";
    },
    {
      code: 6003;
      name: "sameWarriorBattle";
      msg: "Cannot battle with the same warrior";
    },
    {
      code: 6004;
      name: "unauthorized";
      msg: "Unauthorized: Only admin can perform this action";
    }
  ];
  types: [
    {
      name: "achievementLevel";
      type: {
        kind: "enum";
        variants: [
          {
            name: "none";
          },
          {
            name: "bronze";
          },
          {
            name: "silver";
          },
          {
            name: "gold";
          },
          {
            name: "platinum";
          },
          {
            name: "diamond";
          }
        ];
      };
    },
    {
      name: "gameConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "totalWarriorsCreated";
            type: "u32";
          },
          {
            name: "totalBattlesFought";
            type: "u32";
          },
          {
            name: "initializedAt";
            type: "i64";
          },
          {
            name: "isPaused";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "undeadWarrior";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "dna";
            type: "string";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "powerLevel";
            type: "u32";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "battleWins";
            type: "u32";
          },
          {
            name: "battlesFought";
            type: "u32";
          },
          {
            name: "experiencePoints";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "userAchievements";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "warriorCreator";
            type: {
              defined: {
                name: "achievementLevel";
              };
            };
          },
          {
            name: "battleWinner";
            type: {
              defined: {
                name: "achievementLevel";
              };
            };
          },
          {
            name: "battleFighter";
            type: {
              defined: {
                name: "achievementLevel";
              };
            };
          },
          {
            name: "firstWarriorDate";
            type: "i64";
          },
          {
            name: "firstVictoryDate";
            type: "i64";
          },
          {
            name: "totalScore";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "userProfile";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "warriorsCreated";
            type: "u32";
          },
          {
            name: "totalBattlesWon";
            type: "u32";
          },
          {
            name: "totalBattlesFought";
            type: "u32";
          },
          {
            name: "joinDate";
            type: "i64";
          }
        ];
      };
    }
  ];
};
