/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rust_undead.json`.
 */
export type RustUndead = {
  address: "2Nz59jhEqTAA1UAk8QYFEAU87YRm9M9satPYdfJCZkf4";
  metadata: {
    name: "rustUndead";
    version: "0.1.0";
    spec: "0.1.0";
  };
  instructions: [
    {
      name: "answerQuestion";
      discriminator: [86, 3, 30, 143, 53, 98, 98, 243];
      accounts: [
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "attackerWarrior";
          writable: true;
        },
        {
          name: "defenderWarrior";
          writable: true;
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "answer";
          type: "bool";
        },
        {
          name: "clientSeed";
          type: "u8";
        }
      ];
    },
    {
      name: "callbackWarriorStats";
      discriminator: [16, 177, 198, 189, 251, 20, 26, 186];
      accounts: [
        {
          name: "vrfProgramIdentity";
          docs: [
            "This check ensure that the vrf_program_identity (which is a PDA) is a singer",
            "enforcing the callback is executed by the VRF program through CPI"
          ];
          signer: true;
          address: "9irBy75QS2BN81FUgXuHcjqceJJRuc9oDkAe8TKVvvAw";
        },
        {
          name: "warrior";
          writable: true;
        }
      ];
      args: [
        {
          name: "randomness";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "cancelBattle";
      discriminator: [234, 61, 97, 187, 97, 170, 101, 141];
      accounts: [
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "warriorA";
          writable: true;
        },
        {
          name: "warriorB";
          writable: true;
          optional: true;
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "cancelEmptyBattleRoom";
      discriminator: [12, 106, 206, 38, 255, 165, 78, 227];
      accounts: [
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "warriorA";
          writable: true;
        },
        {
          name: "warriorB";
          writable: true;
          optional: true;
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "createBattleRoom";
      discriminator: [58, 179, 128, 246, 115, 154, 79, 95];
      accounts: [
        {
          name: "playerA";
          writable: true;
          signer: true;
        },
        {
          name: "warriorA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  110,
                  100,
                  101,
                  97,
                  100,
                  95,
                  119,
                  97,
                  114,
                  114,
                  105,
                  111,
                  114
                ];
              },
              {
                kind: "account";
                path: "playerA";
              },
              {
                kind: "arg";
                path: "warriorName";
              }
            ];
          };
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
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
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "warriorName";
          type: "string";
        },
        {
          name: "selectedConcepts";
          type: {
            array: ["u8", 5];
          };
        },
        {
          name: "selectedTopics";
          type: {
            array: ["u8", 10];
          };
        },
        {
          name: "selectedQuestions";
          type: {
            array: ["u16", 10];
          };
        },
        {
          name: "correctAnswers";
          type: {
            array: ["bool", 10];
          };
        }
      ];
    },
    {
      name: "createWarrior";
      discriminator: [163, 157, 34, 175, 170, 146, 80, 103];
      accounts: [
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          docs: ["CHECK : The authority for the program"];
        },
        {
          name: "warrior";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  110,
                  100,
                  101,
                  97,
                  100,
                  95,
                  119,
                  97,
                  114,
                  114,
                  105,
                  111,
                  114
                ];
              },
              {
                kind: "account";
                path: "player";
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
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ];
              },
              {
                kind: "account";
                path: "player";
              }
            ];
          };
        },
        {
          name: "userAchievements";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
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
                path: "player";
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
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "oracleQueue";
          writable: true;
          address: "Cuj97ggrhhidhbu39TijNVqE74xvKJ69gDervRUXAxGh";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "programIdentity";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [105, 100, 101, 110, 116, 105, 116, 121];
              }
            ];
          };
        },
        {
          name: "vrfProgram";
          address: "Vrf1RNUjXmQGjmQrQLvJHs9SNkvDJEsRVFPkfSQUwGz";
        },
        {
          name: "slotHashes";
          address: "SysvarS1otHashes111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "dna";
          type: {
            array: ["u8", 8];
          };
        },
        {
          name: "class";
          type: {
            defined: {
              name: "warriorClass";
            };
          };
        },
        {
          name: "clientSeed";
          type: "u8";
        }
      ];
    },
    {
      name: "delegateBattle";
      discriminator: [62, 10, 250, 88, 180, 36, 120, 74];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "bufferBattleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 117, 102, 102, 101, 114];
              },
              {
                kind: "account";
                path: "battleRoom";
              }
            ];
            program: {
              kind: "const";
              value: [
                20,
                125,
                106,
                57,
                101,
                230,
                53,
                252,
                121,
                13,
                102,
                205,
                238,
                219,
                10,
                197,
                207,
                6,
                157,
                202,
                245,
                181,
                19,
                194,
                122,
                237,
                74,
                187,
                185,
                26,
                24,
                123
              ];
            };
          };
        },
        {
          name: "delegationRecordBattleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 101, 108, 101, 103, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "battleRoom";
              }
            ];
            program: {
              kind: "account";
              path: "delegationProgram";
            };
          };
        },
        {
          name: "delegationMetadataBattleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              },
              {
                kind: "account";
                path: "battleRoom";
              }
            ];
            program: {
              kind: "account";
              path: "delegationProgram";
            };
          };
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "bufferWarriorA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 117, 102, 102, 101, 114];
              },
              {
                kind: "account";
                path: "warriorA";
              }
            ];
            program: {
              kind: "const";
              value: [
                20,
                125,
                106,
                57,
                101,
                230,
                53,
                252,
                121,
                13,
                102,
                205,
                238,
                219,
                10,
                197,
                207,
                6,
                157,
                202,
                245,
                181,
                19,
                194,
                122,
                237,
                74,
                187,
                185,
                26,
                24,
                123
              ];
            };
          };
        },
        {
          name: "delegationRecordWarriorA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 101, 108, 101, 103, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "warriorA";
              }
            ];
            program: {
              kind: "account";
              path: "delegationProgram";
            };
          };
        },
        {
          name: "delegationMetadataWarriorA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              },
              {
                kind: "account";
                path: "warriorA";
              }
            ];
            program: {
              kind: "account";
              path: "delegationProgram";
            };
          };
        },
        {
          name: "warriorA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  110,
                  100,
                  101,
                  97,
                  100,
                  95,
                  119,
                  97,
                  114,
                  114,
                  105,
                  111,
                  114
                ];
              },
              {
                kind: "arg";
                path: "playerA";
              },
              {
                kind: "arg";
                path: "warriorAName";
              }
            ];
          };
        },
        {
          name: "bufferWarriorB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 117, 102, 102, 101, 114];
              },
              {
                kind: "account";
                path: "warriorB";
              }
            ];
            program: {
              kind: "const";
              value: [
                20,
                125,
                106,
                57,
                101,
                230,
                53,
                252,
                121,
                13,
                102,
                205,
                238,
                219,
                10,
                197,
                207,
                6,
                157,
                202,
                245,
                181,
                19,
                194,
                122,
                237,
                74,
                187,
                185,
                26,
                24,
                123
              ];
            };
          };
        },
        {
          name: "delegationRecordWarriorB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 101, 108, 101, 103, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "warriorB";
              }
            ];
            program: {
              kind: "account";
              path: "delegationProgram";
            };
          };
        },
        {
          name: "delegationMetadataWarriorB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ];
              },
              {
                kind: "account";
                path: "warriorB";
              }
            ];
            program: {
              kind: "account";
              path: "delegationProgram";
            };
          };
        },
        {
          name: "warriorB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  110,
                  100,
                  101,
                  97,
                  100,
                  95,
                  119,
                  97,
                  114,
                  114,
                  105,
                  111,
                  114
                ];
              },
              {
                kind: "arg";
                path: "playerB";
              },
              {
                kind: "arg";
                path: "warriorBName";
              }
            ];
          };
        },
        {
          name: "ownerProgram";
          address: "2Nz59jhEqTAA1UAk8QYFEAU87YRm9M9satPYdfJCZkf4";
        },
        {
          name: "delegationProgram";
          address: "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "playerA";
          type: "pubkey";
        },
        {
          name: "warriorAName";
          type: "string";
        },
        {
          name: "playerB";
          type: "pubkey";
        },
        {
          name: "warriorBName";
          type: "string";
        }
      ];
    },
    {
      name: "emergencyCancelBattle";
      discriminator: [11, 10, 74, 199, 28, 62, 29, 164];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
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
          name: "magicProgram";
          address: "Magic11111111111111111111111111111111111111";
        },
        {
          name: "magicContext";
          writable: true;
          address: "MagicContext1111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
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
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "leaderboard";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 101, 97, 100, 101, 114, 98, 111, 97, 114, 100];
              },
              {
                kind: "account";
                path: "authority";
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
          name: "cooldownTime";
          type: "u64";
        }
      ];
    },
    {
      name: "joinBattleRoom";
      discriminator: [96, 155, 69, 190, 105, 208, 17, 32];
      accounts: [
        {
          name: "playerB";
          writable: true;
          signer: true;
        },
        {
          name: "warriorB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  110,
                  100,
                  101,
                  97,
                  100,
                  95,
                  119,
                  97,
                  114,
                  114,
                  105,
                  111,
                  114
                ];
              },
              {
                kind: "account";
                path: "playerB";
              },
              {
                kind: "arg";
                path: "warriorName";
              }
            ];
          };
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "warriorName";
          type: "string";
        }
      ];
    },
    {
      name: "processUndelegation";
      discriminator: [196, 28, 41, 206, 48, 37, 51, 167];
      accounts: [
        {
          name: "baseAccount";
          writable: true;
        },
        {
          name: "buffer";
        },
        {
          name: "payer";
          writable: true;
        },
        {
          name: "systemProgram";
        }
      ];
      args: [
        {
          name: "accountSeeds";
          type: {
            vec: "bytes";
          };
        }
      ];
    },
    {
      name: "settleBattleRoom";
      discriminator: [254, 23, 210, 244, 99, 15, 11, 61];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "warriorA";
          writable: true;
        },
        {
          name: "warriorB";
          writable: true;
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "signalReady";
      discriminator: [96, 49, 44, 123, 65, 227, 168, 32];
      accounts: [
        {
          name: "player";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "warrior";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  110,
                  100,
                  101,
                  97,
                  100,
                  95,
                  119,
                  97,
                  114,
                  114,
                  105,
                  111,
                  114
                ];
              },
              {
                kind: "account";
                path: "player";
              },
              {
                kind: "arg";
                path: "warriorName";
              }
            ];
          };
        },
        {
          name: "warriorA";
          writable: true;
        },
        {
          name: "warriorB";
          writable: true;
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "warriorName";
          type: "string";
        }
      ];
    },
    {
      name: "startBattle";
      discriminator: [87, 12, 31, 196, 33, 191, 140, 147];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
        },
        {
          name: "warriorA";
          writable: true;
        },
        {
          name: "warriorB";
          writable: true;
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "undelegateBattleRoom";
      discriminator: [221, 93, 230, 24, 192, 98, 219, 26];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
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
          name: "magicProgram";
          address: "Magic11111111111111111111111111111111111111";
        },
        {
          name: "magicContext";
          writable: true;
          address: "MagicContext1111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    },
    {
      name: "updateFinalState";
      discriminator: [59, 58, 77, 84, 97, 73, 221, 76];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
        },
        {
          name: "battleRoom";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [98, 97, 116, 116, 108, 101, 114, 111, 111, 109];
              },
              {
                kind: "arg";
                path: "roomId";
              }
            ];
          };
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
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ];
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
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ];
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
          name: "achievementsA";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
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
                path: "warrior_a.owner";
                account: "undeadWarrior";
              }
            ];
          };
        },
        {
          name: "achievementsB";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  117,
                  115,
                  101,
                  114,
                  95,
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
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "leaderboard";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 101, 97, 100, 101, 114, 98, 111, 97, 114, 100];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "roomId";
          type: {
            array: ["u8", 32];
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "battleRoom";
      discriminator: [51, 147, 104, 79, 145, 40, 116, 24];
    },
    {
      name: "config";
      discriminator: [155, 12, 170, 224, 30, 250, 204, 130];
    },
    {
      name: "leaderboard";
      discriminator: [247, 186, 238, 243, 194, 30, 9, 36];
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
      name: "invalidWarriorState";
      msg: "Warrior is not in the correct state for this action";
    },
    {
      code: 6001;
      name: "notWarriorOwner";
      msg: "Only the warrior owner can perform this action";
    },
    {
      code: 6002;
      name: "warriorNameTooLong";
      msg: "Warrior name exceeds maximum length";
    },
    {
      code: 6003;
      name: "warriorAlreadyInBattle";
      msg: "Warrior is already in a battle";
    },
    {
      code: 6004;
      name: "warriorAlreadyExists";
      msg: "Warrior Name already exists";
    },
    {
      code: 6005;
      name: "warriorOnCooldown";
      msg: "Warrior On Cooldown";
    },
    {
      code: 6006;
      name: "invalidBattleState";
      msg: "Battle room is not in the correct state for this action";
    },
    {
      code: 6007;
      name: "battleRoomFull";
      msg: "Battle room already has two players";
    },
    {
      code: 6008;
      name: "notBattleParticipant";
      msg: "Only battle participants can perform this action";
    },
    {
      code: 6009;
      name: "playerNotReady";
      msg: "Player has not marked themselves as ready";
    },
    {
      code: 6010;
      name: "battleAlreadySettled";
      msg: "Battle results have already been settled";
    },
    {
      code: 6011;
      name: "invalidRoomId";
      msg: "Room ID is invalid or too long";
    },
    {
      code: 6012;
      name: "vrfRequestPending";
      msg: "VRF request is still pending";
    },
    {
      code: 6013;
      name: "invalidVrfResult";
      msg: "Invalid VRF result received";
    },
    {
      code: 6014;
      name: "vrfRequestNotFound";
      msg: "VRF request not found or expired";
    },
    {
      code: 6015;
      name: "notAuthorized";
      msg: "Not authorized to perform this action";
    },
    {
      code: 6016;
      name: "invalidSettlementAuthority";
      msg: "Invalid settlement authority";
    },
    {
      code: 6017;
      name: "insufficientFunds";
      msg: "Insufficient funds for this operation";
    },
    {
      code: 6018;
      name: "invalidConceptSelection";
      msg: "Invalid concept selection";
    },
    {
      code: 6019;
      name: "gameNotInitialized";
      msg: "Game state has not been initialized";
    },
    {
      code: 6020;
      name: "invalidErSessionId";
      msg: "Invalid ephemeral rollup session ID";
    },
    {
      code: 6021;
      name: "playerNotInRoom";
      msg: "Player not in room";
    },
    {
      code: 6022;
      name: "alreadyReady";
      msg: "Player is ready";
    },
    {
      code: 6023;
      name: "invalidWarrior";
      msg: "Invalid Warrior";
    },
    {
      code: 6024;
      name: "sameWarriorCannotBattle";
      msg: "Same Warrior cannot Battle";
    },
    {
      code: 6025;
      name: "warriorDefeated";
      msg: "Warrior defeated";
    },
    {
      code: 6026;
      name: "alreadyAnswered";
      msg: "Player has already answered this question";
    },
    {
      code: 6027;
      name: "allQuestionsAnswered";
      msg: "All Questions answered";
    },
    {
      code: 6028;
      name: "nameTooLong";
      msg: "Name is too long, consider reducing it";
    },
    {
      code: 6029;
      name: "nameEmpty";
      msg: "Invalid, please input name";
    },
    {
      code: 6030;
      name: "cannotAttackSelf";
      msg: "Warrior cannot attack itself";
    },
    {
      code: 6031;
      name: "invalidQuestionIndex";
      msg: "Invalid Question Index";
    },
    {
      code: 6032;
      name: "onlyCreatorCanCancel";
      msg: "Only the room creator can cancel the battle";
    },
    {
      code: 6033;
      name: "battleAlreadyStarted";
      msg: "Battle has already started and cannot be cancelled";
    },
    {
      code: 6034;
      name: "battleAlreadyCompleted";
      msg: "Battle has already been completed";
    },
    {
      code: 6035;
      name: "battleAlreadyCancelled";
      msg: "Battle room has already been cancelled";
    },
    {
      code: 6036;
      name: "cannotCancelAtThisStage";
      msg: "Cannot cancel battle at this stage";
    },
    {
      code: 6037;
      name: "cannotUndelegate";
      msg: "Game not ready for Undelegation";
    },
    {
      code: 6038;
      name: "invalidImageIndex";
      msg: "Invalid image index for the selected rarity";
    },
    {
      code: 6039;
      name: "invalidClassRarity";
      msg: "Invalid warrior class and rarity combination";
    },
    {
      code: 6040;
      name: "imageGenerationFailed";
      msg: "Image generation failed";
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
      name: "battleRoom";
      type: {
        kind: "struct";
        fields: [
          {
            name: "roomId";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "playerA";
            type: "pubkey";
          },
          {
            name: "playerB";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "warriorA";
            type: "pubkey";
          },
          {
            name: "warriorB";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "selectedConcepts";
            type: {
              array: ["u8", 5];
            };
          },
          {
            name: "selectedTopics";
            type: {
              array: ["u8", 10];
            };
          },
          {
            name: "selectedQuestions";
            type: {
              array: ["u16", 10];
            };
          },
          {
            name: "correctAnswers";
            type: {
              array: ["bool", 10];
            };
          },
          {
            name: "state";
            type: {
              defined: {
                name: "battleState";
              };
            };
          },
          {
            name: "playerAReady";
            type: "bool";
          },
          {
            name: "playerBReady";
            type: "bool";
          },
          {
            name: "currentQuestion";
            type: "u8";
          },
          {
            name: "playerAAnswers";
            type: {
              array: [
                {
                  option: "bool";
                },
                10
              ];
            };
          },
          {
            name: "playerBAnswers";
            type: {
              array: [
                {
                  option: "bool";
                },
                10
              ];
            };
          },
          {
            name: "playerACorrect";
            type: "u8";
          },
          {
            name: "playerBCorrect";
            type: "u8";
          },
          {
            name: "winner";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "battleDuration";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "battleStartTime";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "battleState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "created";
          },
          {
            name: "joined";
          },
          {
            name: "questionsSelected";
          },
          {
            name: "readyForDelegation";
          },
          {
            name: "inProgress";
          },
          {
            name: "completed";
          },
          {
            name: "cancelled";
          }
        ];
      };
    },
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "totalWarriors";
            type: "u64";
          },
          {
            name: "cooldownTime";
            type: "u64";
          },
          {
            name: "totalBattles";
            type: "u32";
          },
          {
            name: "isPaused";
            type: "bool";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "imageRarity";
      type: {
        kind: "enum";
        variants: [
          {
            name: "common";
          },
          {
            name: "uncommon";
          },
          {
            name: "rare";
          }
        ];
      };
    },
    {
      name: "leaderboard";
      type: {
        kind: "struct";
        fields: [
          {
            name: "topPlayers";
            type: {
              array: ["pubkey", 20];
            };
          },
          {
            name: "topScores";
            type: {
              array: ["u32", 20];
            };
          },
          {
            name: "lastUpdated";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
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
            name: "address";
            type: "pubkey";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "dna";
            type: {
              array: ["u8", 8];
            };
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "baseAttack";
            type: "u16";
          },
          {
            name: "baseDefense";
            type: "u16";
          },
          {
            name: "baseKnowledge";
            type: "u16";
          },
          {
            name: "currentHp";
            type: "u16";
          },
          {
            name: "maxHp";
            type: "u16";
          },
          {
            name: "warriorClass";
            type: {
              defined: {
                name: "warriorClass";
              };
            };
          },
          {
            name: "battlesWon";
            type: "u32";
          },
          {
            name: "battlesLost";
            type: "u32";
          },
          {
            name: "experiencePoints";
            type: "u64";
          },
          {
            name: "level";
            type: "u16";
          },
          {
            name: "lastBattleAt";
            type: "i64";
          },
          {
            name: "cooldownExpiresAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "imageRarity";
            type: {
              defined: {
                name: "imageRarity";
              };
            };
          },
          {
            name: "imageIndex";
            type: "u8";
          },
          {
            name: "imageUri";
            type: "string";
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
            name: "overallAchievements";
            type: {
              defined: {
                name: "achievementLevel";
              };
            };
          },
          {
            name: "warriorAchivement";
            type: {
              defined: {
                name: "achievementLevel";
              };
            };
          },
          {
            name: "winnerAchievement";
            type: {
              defined: {
                name: "achievementLevel";
              };
            };
          },
          {
            name: "battleAchievement";
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
            name: "bump";
            type: "u8";
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
            name: "totalBattlesLost";
            type: "u32";
          },
          {
            name: "totalBattlesFought";
            type: "u32";
          },
          {
            name: "joinDate";
            type: "i64";
          },
          {
            name: "totalPoints";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "warriorClass";
      type: {
        kind: "enum";
        variants: [
          {
            name: "validator";
          },
          {
            name: "oracle";
          },
          {
            name: "guardian";
          },
          {
            name: "daemon";
          }
        ];
      };
    }
  ];
};
