export type StakesWtf = {
    "version": "0.1.0",
    "name": "stakes_wtf",
    "instructions": [
      {
        "name": "initializePool",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "InitializePoolData"
            }
          }
        ]
      },
      {
        "name": "syncBribes",
        "accounts": [
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "SyncBribesData"
            }
          }
        ]
      },
      {
        "name": "stake",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userGovToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "StakeData"
            }
          }
        ]
      },
      {
        "name": "unstake",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vestingPosition",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vestingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userGovToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "UnstakeData"
            }
          }
        ]
      },
      {
        "name": "claimVested",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vestingPosition",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vestingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingPool",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "ClaimVestedData"
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "stakingPool",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": {
                "array": [
                  "u8",
                  1
                ]
              }
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "govMint",
              "type": "publicKey"
            },
            {
              "name": "govPrice",
              "type": "u64"
            },
            {
              "name": "activeBalance",
              "type": "u64"
            },
            {
              "name": "lastBribeDistributionTimestamp",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "vestingPosition",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "stakingPool",
              "type": "publicKey"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "lastClaimTimestamp",
              "type": "i64"
            },
            {
              "name": "claimPerDay",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "ClaimVestedData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      },
      {
        "name": "InitializePoolData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      },
      {
        "name": "StakeData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "amount",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "SyncBribesData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      },
      {
        "name": "UnstakeData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidMint",
        "msg": "Invalid mint"
      },
      {
        "code": 6001,
        "name": "InvalidOwner",
        "msg": "Invalid owner"
      },
      {
        "code": 6002,
        "name": "InvalidPool",
        "msg": "Invalid pool"
      },
      {
        "code": 6003,
        "name": "ValueOverflow",
        "msg": "Value overflow occured"
      }
    ]
  };
  
  export const IDL: StakesWtf = {
    "version": "0.1.0",
    "name": "stakes_wtf",
    "instructions": [
      {
        "name": "initializePool",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "InitializePoolData"
            }
          }
        ]
      },
      {
        "name": "syncBribes",
        "accounts": [
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "SyncBribesData"
            }
          }
        ]
      },
      {
        "name": "stake",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userGovToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "StakeData"
            }
          }
        ]
      },
      {
        "name": "unstake",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vestingPosition",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vestingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingPool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "govMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userGovToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "UnstakeData"
            }
          }
        ]
      },
      {
        "name": "claimVested",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vestingPosition",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vestingVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "stakingPool",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": {
              "defined": "ClaimVestedData"
            }
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "stakingPool",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": {
                "array": [
                  "u8",
                  1
                ]
              }
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "govMint",
              "type": "publicKey"
            },
            {
              "name": "govPrice",
              "type": "u64"
            },
            {
              "name": "activeBalance",
              "type": "u64"
            },
            {
              "name": "lastBribeDistributionTimestamp",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "vestingPosition",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "stakingPool",
              "type": "publicKey"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "lastClaimTimestamp",
              "type": "i64"
            },
            {
              "name": "claimPerDay",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "ClaimVestedData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      },
      {
        "name": "InitializePoolData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      },
      {
        "name": "StakeData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "amount",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "SyncBribesData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      },
      {
        "name": "UnstakeData",
        "type": {
          "kind": "struct",
          "fields": []
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidMint",
        "msg": "Invalid mint"
      },
      {
        "code": 6001,
        "name": "InvalidOwner",
        "msg": "Invalid owner"
      },
      {
        "code": 6002,
        "name": "InvalidPool",
        "msg": "Invalid pool"
      },
      {
        "code": 6003,
        "name": "ValueOverflow",
        "msg": "Value overflow occured"
      }
    ]
  };
  