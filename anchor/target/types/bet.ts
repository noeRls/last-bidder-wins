/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bet.json`.
 */
export type Bet = {
  "address": "7x5a4DsG7gtWDLyrDUWXqqbzWBc3CpD3vR1vNUD1R8ag",
  "metadata": {
    "name": "bet",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "bet",
      "discriminator": [
        94,
        203,
        166,
        126,
        20,
        243,
        169,
        82
      ],
      "accounts": [
        {
          "name": "bidder",
          "writable": true,
          "signer": true
        },
        {
          "name": "betState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "depositAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "bidder"
              }
            ]
          }
        },
        {
          "name": "feeAddress",
          "writable": true,
          "address": "H2tRSUTkwqXm5Uba6GRqrvPwH5m4ziyBMQYMkNEiqf3H"
        }
      ],
      "args": [
        {
          "name": "betAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createDeposit",
      "discriminator": [
        157,
        30,
        11,
        129,
        16,
        166,
        115,
        75
      ],
      "accounts": [
        {
          "name": "bidder",
          "writable": true,
          "signer": true
        },
        {
          "name": "depositAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "bidder"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "setup",
      "discriminator": [
        137,
        0,
        196,
        175,
        166,
        131,
        77,
        178
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "betState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "winner",
          "writable": true,
          "signer": true
        },
        {
          "name": "betState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "betState",
      "discriminator": [
        143,
        61,
        238,
        62,
        232,
        157,
        101,
        185
      ]
    },
    {
      "name": "empty",
      "discriminator": [
        15,
        64,
        23,
        223,
        220,
        243,
        41,
        219
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientFundsForTransaction",
      "msg": "Not enough sol to complete the transaction"
    },
    {
      "code": 6001,
      "name": "tooSmallBet",
      "msg": "Bet not high enough"
    },
    {
      "code": 6002,
      "name": "timeRemaining",
      "msg": "Not ready for withdraw, there is some time remaining"
    }
  ],
  "types": [
    {
      "name": "betState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastBetAccount",
            "type": "pubkey"
          },
          {
            "name": "lastBetValue",
            "type": "u64"
          },
          {
            "name": "winAtSlot",
            "type": "u64"
          },
          {
            "name": "prizepool",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "empty",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ]
};
