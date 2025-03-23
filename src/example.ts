import { Pokedex } from '@fairfooddata/types';

export const example: Pokedex = {
  description:
    'PGgxIHN0eWxlPSJjb2xvcjogIzJlNmM4MDsiPldlbGNvbWUgdG8gdGhlIHRyYW5zcGFyZW50IGZvb2QgY2hhaW4hPC9oMT4NCjxwPldlIHRob3VnaHQgdGhlIGJlbG93IGRhdGEgY291bGQgYmUgZXNzZW50aWFsIHRvIGtub3cgd2hhdCB5b3UgZWF0LCBzbyB3ZSBtYWRlIGl0IGVhc2lseSBhY2Nlc3NpYmxlLiBUaGVzZSB2YWx1ZXMgd2VyZSBwdWJsaXNoZWQgdmlhIEV0aGVyZXVtIFN3YXJtLCB0aGUgY2Vuc29yc2hpcC1yZXNpc3RhbnQgZGVjZW50cmFsaXplZCBzdG9yYWdlLCB3aGljaCA8YSBocmVmPSJodHRwczovL2FkbWluLm1vcmFsaXMuaW8vcGxheWdyb3VuZCIgdGFyZ2V0PSJfYmxhbmsiPnlvdSBjYW4gdmVyaWZ5IGhlcmU8L2E+LjwvcD4=',
  contract: '0x78331a8C0089Cf29185F2CC9aEA97f7b6E9F8fB6',
  token: '19',
  feedchainVersion: '0.1',
  instance: {
    category: 'food',
    type: 'strawberry_kiwi_cake',
    bio: false,
    expiryDate: 1984317400,
    format: 'printed',
    ownerId: 'essencefood.tech',
    quantity: 1000,
    iDs: [{ registry: 'URL_retail', id: 'https://order.moodbytes.tech/' }],
    price: {
      amount: 1000,
      currency: '0x18c8a7ec7897177e4529065a7e7b0878358b3bff',
      type: 'budget',
    },
    process: {
      type: 'printing',
      knowHow: {
        owner: '36b7efd913ca4cf880b8eeac5093fa27b0825906',
        hash: 'cf880b8eeac5093fa27b0825906c600685',
        inputs: '',
        outputs: '',
        licenseFee: {
          amount: 1,
          currency: 'DAI',
          type: 'budget',
        },
      },
      timestamp: 1696465437,
      duration: 600,
      facility: {
        label: 'Printing Facility E',
        location: {
          type: 'Point',
          coordinates: [1.777312, 41.259187],
        },
      },
      temperatureRange: {
        min: -45,
        max: 22,
      },
      machineInstance: {
        category: 'machine_3Dprinter',
        ownerId: 'johndoehub.com',
        quantity: 1,
        size: '115x75x55cm',
        hr: {
          tasks: 'loading, starting, unloading',
          assignee: 'jane.doe@johndoehub.com',
        },
        providerSDomain: 'johndoehub.com',
      },
      shape: 'tree.stl',
      inputInstances: [
        {
          type: 'transported',
          transport: {
            method: 'land',
            fuelType: 'electric',
            weight: 0.0002,
            deparetureTime: 1696461437,
            duration: 18000,
          },
          quantity: 1,
          instance: {
            category: 'cartridge',
            type: 'microline',
            ownerId: 'essencefood.tech',
            bio: false,
            grade: 'A',
            size: '3x2',
            quantity: 1,
          },
        },
        {
          type: 'local',
          instance: {
            category: 'food',
            type: 'water',
            bio: true,
            quantity: 1,
          },
          quantity: 1,
        },
        {
          type: 'transported',
          transport: {
            method: 'air',
            fuelType: 'kerosene',
            weight: 0.00000001,
            deparetureTime: 1696460437,
            duration: 21600,
          },
          quantity: 6,
          instance: {
            category: 'food',
            type: 'strawberry_kiwi_powder_blend',
            ownerId: 'essencefood.tech',
            expiryDate: 1984317400,
            format: 'powder',
            bio: false,
            grade: 'A',
            size: '3',
            quantity: 3.5,
            process: {
              type: 'blending',
              knowHow: {
                owner: '36b7efd913ca4cf880b8eeac5093fa27b0825906',
                hash: 'cf880b8eeac5093fa27b0825906c600685',
                inputs: '',
                outputs: '',
                licenseFee: {
                  amount: 2,
                  currency: 'DAI',
                  type: 'budget',
                },
                note: '',
              },
              timestamp: 1696457437,
              duration: 1200,
              facility: {
                label: 'Blending Facility D',
                location: {
                  type: 'Point',
                  coordinates: [-2.567003, 51.412577],
                },
              },
              temperatureRange: {
                min: -45,
                max: 22,
              },
              inputInstances: [
                {
                  type: 'transported',
                  transport: {
                    method: 'land',
                    fuelType: 'petrol',
                    weight: 0.0002,
                    deparetureTime: 1696453437,
                    duration: 21600,
                  },
                  quantity: 2,
                  instance: {
                    category: 'food',
                    type: 'strawberry_lyophilised',
                    iDs: [
                      {
                        registry: 'FDC',
                        id: '2344739',
                      },
                    ],
                    ownerId: 'blendhub.com',
                    expiryDate: 1984317400,
                    format: 'powder',
                    bio: false,
                    grade: 'A',
                    quantity: 3,
                    process: {
                      type: 'milling',
                      knowHow: {
                        owner: '36b7efd913ca4cf880b8eeac5093fa27b0825906',
                        hash: 'cf880b9eeac5093fa27b0825906c600685',
                        inputs: '',
                        outputs: '',
                        licenseFee: {
                          amount: 3,
                          currency: 'DAI',
                          type: 'budget',
                        },
                        note: {
                          'Particle size (micron)': 7,
                        },
                      },
                      timestamp: 1696449437,
                      duration: 360,
                      facility: {
                        label: 'Milling Facility C',
                        location: {
                          type: 'Point',
                          coordinates: [10.252544038414928, 45.48027689773346],
                        },
                      },

                      temperatureRange: {
                        min: -45,
                        max: 22,
                      },
                      inputInstances: [
                        // {
                        //   type: 'transported',
                        //   transport: {
                        //     method: 'sea',
                        //     fuelType: 'diesel',
                        //     weight: 0.00000004,
                        //     deparetureTime: 1696400437,
                        //     duration: 1036800,
                        //   },
                        //   quantity: 3,
                        //   instance:
                        //     'https://api.gateway.ethswarm.org/bzz/30f5c5a8ad6f41784e5d11bb33b08730bf71a3cd6bb5d75e391ed62172cad78d/',
                        // },
                        {
                          type: 'transported',
                          transport: {
                            method: 'sea',
                            fuelType: 'diesel',
                            weight: 0.00000004,
                            deparetureTime: 1696409437,
                            duration: 1036800,
                          },
                          quantity: 2,
                          instance: {
                            category: 'food',
                            type: 'Mango_lyophilised',
                            iDs: [
                              {
                                registry: 'FDC',
                                id: '2344738',
                              },
                            ],
                            ownerId: 'essencefood.tech',
                            expiryDate: 1759562637,
                            format: 'slices',
                            bio: false,
                            grade: 'A',
                            size: '1.5 cm',
                            quantity: 10,
                            process: {
                              type: 'freezedrying',
                              knowHow: {
                                owner:
                                  '36b7efd913ca4cf880b8eeac5093fa27b0825906',
                                hash: 'cf880b9eeac5093fa27b0825906c600685',
                                inputs: '',
                                outputs: '',
                                licenseFee: {
                                  amount: 4,
                                  currency: 'DAI',
                                  type: 'budget',
                                },
                                note: 'Mango can be whole, or sliced/diced.',
                              },
                              timestamp: 1696389437,
                              duration: 300,
                              facility: {
                                label: 'Freezedrying Facility B',
                                location: {
                                  type: 'Point',
                                  coordinates: [
                                    -48.3524439200693, -1.364037175459345,
                                  ],
                                },
                              },
                              temperatureRange: {
                                min: -38,
                                max: 57,
                              },
                              inputInstances: [
                                {
                                  type: 'transported',
                                  transport: {
                                    method: 'land',
                                    fuelType: 'diesel',
                                    weight: 1.0,
                                    deparetureTime: 1696349437,
                                    duration: 3600,
                                  },
                                  quantity: 20,
                                  instance: {
                                    category: 'food',
                                    type: 'Mango',
                                    iDs: [
                                      {
                                        registry: 'FDC',
                                        id: '2344737',
                                      },
                                    ],
                                    ownerId: 'essencefood.tech',
                                    expiryDate: 1696512237,
                                    format: 'whole',
                                    bio: false,
                                    grade: 'Ugly',
                                    size: '3 cm',
                                    quantity: 2000,
                                    process: {
                                      type: 'harvest',
                                      timestamp: 1696339437,
                                      facility: {
                                        label: 'Plant A',
                                        location: {
                                          type: 'Point',
                                          coordinates: [-59.886277, -7.198175],
                                        },
                                      },
                                      temperatureRange: {
                                        min: -45,
                                        max: 22,
                                      },
                                      inputInstances: [
                                        {
                                          type: 'local',
                                          instance: {
                                            category: 'food',
                                            type: 'Mango',
                                            bio: true,
                                            quantity: 1,
                                          },
                                          quantity: 20000,
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                              machineInstance: {
                                category: 'freeze dryer machine',
                                ownerId: 'essencefood.tech',
                                quantity: 1,
                                size: '115x75x55cm',
                                hr: {
                                  tasks: 'washing, cutting, loading',
                                  assignee: 'g@essencefood.tech',
                                },
                                providerSDomain: 'essencefood.tech',
                              },
                              impacts: [
                                {
                                  category: 'carbon',
                                  ownerId: 'essencefood.tech',
                                  format: 'avoidance',
                                  quantity: 44.0,
                                },
                                {
                                  category: 'water',
                                  ownerId: 'essencefood.tech',
                                  format: 'avoidance',
                                  quantity: 18.0,
                                },
                              ],
                            },
                          },
                        },
                      ],
                      machineInstance: {
                        category: 'machine_milling',
                        ownerId: 'johndoehub.com',
                        quantity: 1,
                        size: '115x75x55cm',
                        hr: {
                          tasks: 'loading, starting, unloading',
                          assignee: 'jane.doe@johndoehub.com',
                        },
                        providerSDomain: 'johndoehub.com',
                      },
                    },
                  },
                },
                // {
                //   type: 'transported',
                //   transport: {
                //     method: 'sea',
                //     fuelType: 'diesel',
                //     weight: 0.00000004,
                //     deparetureTime: 1684326200,
                //     duration: 1036800,
                //   },
                //   instance: 'apiTest.json',
                //   quantity: 1.5,
                // },
              ],
              machineInstance: {
                category: 'machine_blender',
                ownerId: 'johndoehub.com',
                quantity: 1,
                size: '115x275x55cm',
                hr: {
                  tasks: 'loading, starting, unloading',
                  assignee: 'jane.doe@johndoehub.com',
                },
                providerSDomain: 'johndoehub.com',
              },
            },
          },
        },
      ],
    },
  },
};

// export const example: Pokedex = {
//   description: 'Button test',
//   contract: '0x78331a8C0089Cf29185F2CC9aEA97f7b6E9F8fB6',
//   token: '164',
//   feedchainVersion: '0.1',
//   sale: {
//     type: 'sale',
//     price: {
//       amount: 3,
//       currency: 'EUR',
//     },
//     timestamp: 1696480437,
//     temperatureRange: {
//       min: -45,
//       max: 22,
//     },
//     location: {
//       type: 'Point',
//       coordinates: [19.027148, 47.952455],
//     },
//     inputInstances: [
//       {
//         transport: {
//           method: 'sea',
//           fuelType: 'diesel',
//           weight: 4e-8,
//           deparetureTime: 1696475437,
//           duration: 1036800,
//         },
//         quantity: 4,
//         instance: {
//           category: 'food',
//           type: 'strawberry_kiwi_cake',
//           bio: false,
//           expiryDate: 1984317400,
//           format: 'printed',
//           ownerId: 'essencefood.tech',
//           quantity: 1,
//           iDs: [
//             {
//               registry: 'URL_retail',
//               id: 'https://order.moodbytes.tech/',
//             },
//           ],
//           process: {
//             type: 'printing',
//             knowHow: {
//               owner: '36b7efd913ca4cf880b8eeac5093fa27b0825906',
//               hash: 'cf880b8eeac5093fa27b0825906c600685',
//               inputs: '',
//               outputs: '',
//               licenseFee: {
//                 amount: 1,
//                 currency: 'DAI',
//               },
//             },
//             timestamp: 1696465437,
//             duration: 600,
//             location: {
//               type: 'Point',
//               coordinates: [1.777312, 41.259187],
//             },
//             temperatureRange: {
//               min: -45,
//               max: 22,
//             },
//             machineInstance: {
//               category: 'machine_3Dprinter',
//               ownerId: 'johndoehub.com',
//               quantity: 1,
//               size: '115x75x55cm',
//               hr: {
//                 tasks: 'loading, starting, unloading',
//                 assignee: 'jane.doe@johndoehub.com',
//               },
//               providerSDomain: 'johndoehub.com',
//             },
//             shape: 'tree.stl',
//             inputInstances: [
//               {
//                 transport: {
//                   method: 'land',
//                   fuelType: 'electric',
//                   weight: 0.0002,
//                   deparetureTime: 1696461437,
//                   duration: 18000,
//                 },
//                 quantity: 1,
//                 instance: {
//                   category: 'cartridge',
//                   ownerId: 'essencefood.tech',
//                   bio: false,
//                   grade: 'A',
//                   size: '3x2',
//                   quantity: 1,
//                 },
//               },
//               {
//                 instance: {
//                   category: 'food',
//                   type: 'water',
//                   bio: true,
//                   quantity: 1,
//                 },
//                 quantity: 1,
//               },
//               {
//                 transport: {
//                   method: 'air',
//                   fuelType: 'kerosene',
//                   weight: 1e-8,
//                   deparetureTime: 1696460437,
//                   duration: 21600,
//                 },
//                 quantity: 6,
//                 instance: {
//                   category: 'food',
//                   type: 'strawberry_kiwi_powder_blend',
//                   ownerId: 'essencefood.tech',
//                   expiryDate: 1984317400,
//                   format: 'powder',
//                   bio: false,
//                   grade: 'A',
//                   size: '3',
//                   quantity: 1,
//                   process: {
//                     type: 'blending',
//                     knowHow: {
//                       owner: '36b7efd913ca4cf880b8eeac5093fa27b0825906',
//                       hash: 'cf880b8eeac5093fa27b0825906c600685',
//                       inputs: '',
//                       outputs: '',
//                       licenseFee: {
//                         amount: 2,
//                         currency: 'DAI',
//                       },
//                       note: '',
//                     },
//                     timestamp: 1696457437,
//                     duration: 1200,
//                     location: {
//                       type: 'Point',
//                       coordinates: [-2.567003, 51.412577],
//                     },
//                     temperatureRange: {
//                       min: -45,
//                       max: 22,
//                     },
//                     inputInstances: [
//                       {
//                         transport: {
//                           method: 'land',
//                           fuelType: 'petrol',
//                           weight: 0.0002,
//                           deparetureTime: 1696453437,
//                           duration: 21600,
//                         },
//                         quantity: 2,
//                         instance: {
//                           category: 'food',
//                           type: 'strawberry_lyophilised',
//                           iDs: [
//                             {
//                               registry: 'FDC',
//                               id: '2344739',
//                             },
//                           ],
//                           ownerId: 'blendhub.com',
//                           expiryDate: 1984317400,
//                           format: 'powder',
//                           bio: false,
//                           grade: 'A',
//                           quantity: 1,
//                           process: {
//                             type: 'milling',
//                             knowHow: {
//                               owner: '36b7efd913ca4cf880b8eeac5093fa27b0825906',
//                               hash: 'cf880b9eeac5093fa27b0825906c600685',
//                               inputs: '',
//                               outputs: '',
//                               licenseFee: {
//                                 amount: 3,
//                                 currency: 'DAI',
//                               },
//                               note: {
//                                 'Particle size (micron)': 7,
//                               },
//                             },
//                             timestamp: 1696449437,
//                             duration: 360,
//                             location: {
//                               type: 'Point',
//                               coordinates: [
//                                 10.252544038414928, 45.48027689773346,
//                               ],
//                             },
//                             temperatureRange: {
//                               min: -45,
//                               max: 22,
//                             },
//                             inputInstances: [
//                               {
//                                 transport: {
//                                   method: 'sea',
//                                   fuelType: 'diesel',
//                                   weight: 4e-8,
//                                   deparetureTime: 1696400437,
//                                   duration: 1036800,
//                                 },
//                                 quantity: 3,
//                                 instance:
//                                   'https://api.gateway.ethswarm.org/bzz/30f5c5a8ad6f41784e5d11bb33b08730bf71a3cd6bb5d75e391ed62172cad78d/',
//                               },
//                               {
//                                 transport: {
//                                   method: 'sea',
//                                   fuelType: 'diesel',
//                                   weight: 4e-8,
//                                   deparetureTime: 1696409437,
//                                   duration: 1036800,
//                                 },
//                                 quantity: 2,
//                                 instance: {
//                                   category: 'food',
//                                   type: 'Mango_lyophilised',
//                                   iDs: [
//                                     {
//                                       registry: 'FDC',
//                                       id: '2344738',
//                                     },
//                                     {
//                                       registry: 'URL_retail',
//                                       id: 'https://order.moodbytes.tech/',
//                                     },
//                                   ],
//                                   ownerId: 'essencefood.tech',
//                                   expiryDate: 1759562637,
//                                   format: 'slices',
//                                   bio: false,
//                                   grade: 'A',
//                                   size: '1.5 cm',
//                                   quantity: 1,
//                                   process: {
//                                     type: 'freezedrying',
//                                     knowHow: {
//                                       owner:
//                                         '36b7efd913ca4cf880b8eeac5093fa27b0825906',
//                                       hash: 'cf880b9eeac5093fa27b0825906c600685',
//                                       inputs: '',
//                                       outputs: '',
//                                       licenseFee: {
//                                         amount: 4,
//                                         currency: 'DAI',
//                                       },
//                                       note: 'Mango can be whole, or sliced/diced.',
//                                     },
//                                     timestamp: 1696389437,
//                                     duration: 300,
//                                     location: {
//                                       type: 'Point',
//                                       coordinates: [
//                                         -48.3524439200693, -1.364037175459345,
//                                       ],
//                                     },
//                                     temperatureRange: {
//                                       min: -38,
//                                       max: 57,
//                                     },
//                                     inputInstances: [
//                                       {
//                                         transport: {
//                                           method: 'land',
//                                           fuelType: 'diesel',
//                                           weight: 1,
//                                           deparetureTime: 1696349437,
//                                           duration: 3600,
//                                         },
//                                         quantity: 20,
//                                         instance: {
//                                           category: 'food',
//                                           type: 'Mango',
//                                           iDs: [
//                                             {
//                                               registry: 'FDC',
//                                               id: '234437',
//                                             },
//                                           ],
//                                           ownerId: 'essencefood.tech',
//                                           expiryDate: 1696512237,
//                                           format: 'whole',
//                                           nutrients: [
//                                             {
//                                               amount: 1000,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1079',
//                                               },
//                                             },
//                                             {
//                                               amount: 100,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1087',
//                                               },
//                                             },
//                                             {
//                                               amount: 100,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1089',
//                                               },
//                                             },
//                                             {
//                                               amount: 10,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1090',
//                                               },
//                                             },
//                                             {
//                                               amount: 1000,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1162',
//                                               },
//                                             },
//                                             {
//                                               amount: 100,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1092',
//                                               },
//                                             },
//                                             {
//                                               amount: 100,
//                                               iD: {
//                                                 registry: 'FDC',
//                                                 id: '1095',
//                                               },
//                                             },
//                                           ],
//                                           bio: false,
//                                           grade: 'Ugly',
//                                           size: '3 cm',
//                                           quantity: 1,
//                                           process: {
//                                             type: 'harvest',
//                                             timestamp: 1696339437,
//                                             location: {
//                                               type: 'Point',
//                                               coordinates: [
//                                                 -59.886277, -7.198175,
//                                               ],
//                                             },
//                                             temperatureRange: {
//                                               min: -45,
//                                               max: 22,
//                                             },
//                                             inputInstances: [
//                                               {
//                                                 instance: {
//                                                   category: 'food',
//                                                   type: 'Mango',
//                                                   bio: true,
//                                                   quantity: 1,
//                                                 },
//                                                 quantity: 20000,
//                                               },
//                                             ],
//                                           },
//                                         },
//                                       },
//                                     ],
//                                     machineInstance: {
//                                       category: 'freeze dryer machine',
//                                       ownerId: 'essencefood.tech',
//                                       quantity: 1,
//                                       size: '115x75x55cm',
//                                       hr: {
//                                         tasks: 'washing, cutting, loading',
//                                         assignee: 'g@essencefood.tech',
//                                       },
//                                       providerSDomain: 'essencefood.tech',
//                                     },
//                                     impacts: [
//                                       {
//                                         category: 'carbon',
//                                         ownerId: 'essencefood.tech',
//                                         format: 'avoidance',
//                                         quantity: 44,
//                                       },
//                                       {
//                                         category: 'water',
//                                         ownerId: 'essencefood.tech',
//                                         format: 'avoidance',
//                                         quantity: 18,
//                                       },
//                                     ],
//                                   },
//                                 },
//                               },
//                             ],
//                             machineInstance: {
//                               category: 'machine_milling',
//                               ownerId: 'johndoehub.com',
//                               quantity: 1,
//                               size: '115x75x55cm',
//                               hr: {
//                                 tasks: 'loading, starting, unloading',
//                                 assignee: 'jane.doe@johndoehub.com',
//                               },
//                               providerSDomain: 'johndoehub.com',
//                             },
//                           },
//                         },
//                       },
//                       {
//                         transport: {
//                           method: 'sea',
//                           fuelType: 'diesel',
//                           weight: 4e-8,
//                           deparetureTime: 1684326200,
//                           duration: 1036800,
//                         },
//                         instance: 'apiTest.json',
//                         quantity: 1.5,
//                       },
//                     ],
//                     machineInstance: {
//                       category: 'machine_blender',
//                       ownerId: 'johndoehub.com',
//                       quantity: 1,
//                       size: '115x275x55cm',
//                       hr: {
//                         tasks: 'loading, starting, unloading',
//                         assignee: 'jane.doe@johndoehub.com',
//                       },
//                       providerSDomain: 'johndoehub.com',
//                     },
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       },
//     ],
//   },
// };
