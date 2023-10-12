export type UrlOr<T> = string | T | FetchError;

export interface FetchError {
  errorMessage: string;
}

export interface Pokedex {
  description: string;
  contract: string;
  token: string;
  feedchainVersion: string;
  sale: SaleProcess;
}

export type Process =
  | PrintingProcess
  | MillingProcess
  | FreezeDryingProcess
  | BlendingProcess
  | SaleProcess
  | HarvestProcess;

export interface GenericProcess {
  timestamp: number;
  duration?: number;
  location: GeoJSON.Point;
  temperatureRange: TemperatureRange;
  inputInstances: (TransportedInputInstance | LocalInputInstance)[];
  impacts?: Impact[];
}

export interface PrintingProcess extends GenericProcess {
  type: 'printing';
  machineInstance: MachineInstance;
  knowHow: KnowHow;
  shape: string /* URL */;
}

export interface MillingProcess extends GenericProcess {
  type: 'milling';
  knowHow: KnowHow;
  machineInstance: MachineInstance;
}

export interface FreezeDryingProcess extends GenericProcess {
  type: 'freezedrying';
  knowHow: KnowHow;
  machineInstance: MachineInstance;
}

export interface BlendingProcess extends GenericProcess {
  type: 'blending';
  machineInstance: MachineInstance;
  knowHow: KnowHow;
}

export interface SaleProcess extends GenericProcess {
  type: 'sale';
  price: Price;
}

export interface HarvestProcess extends GenericProcess {
  type: 'harvest';
}

export interface Price {
  amount: number;
  currency: string;
}

export interface GenericInputInstance {
  instance: UrlOr<ProductInstance>;
  /* x 100 (g|ml) */
  quantity: number;
}
export type LocalInputInstance = GenericInputInstance;

export interface TransportedInputInstance extends GenericInputInstance {
  transport: Transport;
}

export type InputInstance = LocalInputInstance | TransportedInputInstance;

export interface Transport {
  method: TransportMethod;
  fuelType: 'hydrogen' | 'electric' | 'diesel' | 'petrol' | 'kerosene';
  weight: number;
  deparetureTime: number;
  duration: number;
}

export type TransportMethod = 'air' | 'sea' | 'land';

export type ProductInstance = FoodInstance | CartridgeInstance;

export interface FoodInstance {
  category: 'food';
  type: string;
  iDs?: IDs;
  nutrients?: FallbackFoodNutrients[];
  ownerId?: string;
  expiryDate?: number;
  format?: string;
  bio: boolean;
  grade?: string;
  size?: string;
  process?: Process;
}

export interface CartridgeInstance {
  category: 'cartridge';
  ownerId: string;
  bio: boolean;
  grade: string;
  size: string;
}

export interface FallbackFoodNutrients {
  amount: number;
  iDs: IDs;
}

export interface MachineInstance {
  category: string;
  ownerId: string;
  quantity: number;
  size: string;
  hr: Hr;
  providerSDomain: string;
}

export interface Hr {
  tasks: string;
  assignee: string;
}

export interface TemperatureRange {
  min: number;
  max: number;
}

export interface KnowHow {
  owner: string;
  hash: string;
  inputs: string;
  outputs: string;
  licenseFee: Price;
  note?: string | object;
}

export interface GenericImpact {
  ownerId: string;
  format: string;
  /* x (g|l) */
  quantity: number;
}

export type Impact = CarbonImpact | WaterImpact;

export interface CarbonImpact extends GenericImpact {
  category: 'carbon';
}

export interface WaterImpact extends GenericImpact {
  category: 'water';
}

export interface IDs {
  registry: string;
  id: number;
}

export const example: Pokedex = {
  description:
    'PGgxIHN0eWxlPSJjb2xvcjogIzJlNmM4MDsiPldlbGNvbWUgdG8gdGhlIHRyYW5zcGFyZW50IGZvb2QgY2hhaW4hPC9oMT4NCjxwPldlIHRob3VnaHQgdGhlIGJlbG93IGRhdGEgY291bGQgYmUgZXNzZW50aWFsIHRvIGtub3cgd2hhdCB5b3UgZWF0LCBzbyB3ZSBtYWRlIGl0IGVhc2lseSBhY2Nlc3NpYmxlLiBUaGVzZSB2YWx1ZXMgd2VyZSBwdWJsaXNoZWQgdmlhIEV0aGVyZXVtIFN3YXJtLCB0aGUgY2Vuc29yc2hpcC1yZXNpc3RhbnQgZGVjZW50cmFsaXplZCBzdG9yYWdlLCB3aGljaCA8YSBocmVmPSJodHRwczovL2FkbWluLm1vcmFsaXMuaW8vcGxheWdyb3VuZCIgdGFyZ2V0PSJfYmxhbmsiPnlvdSBjYW4gdmVyaWZ5IGhlcmU8L2E+LjwvcD4=',
  contract: '0x78331a8C0089Cf29185F2CC9aEA97f7b6E9F8fB6',
  token: '19',
  feedchainVersion: '0.1',
  sale: {
    type: 'sale',
    price: {
      amount: 3,
      currency: 'EUR',
    },
    timestamp: 1696480437,
    temperatureRange: {
      min: -45,
      max: 22,
    },
    location: {
      type: 'Point',
      coordinates: [19.027148, 47.952455],
    },
    inputInstances: [
      {
        transport: {
          method: 'sea',
          fuelType: 'diesel',
          weight: 0.00000004,
          deparetureTime: 1696475437,
          duration: 1036800,
        },
        quantity: 4,
        instance: {
          category: 'food',
          type: 'strawberry_kiwi_cake',
          bio: false,
          expiryDate: 1984317400,
          format: 'printed',
          ownerId: 'essencefood.tech',
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
              },
            },
            timestamp: 1696465437,
            duration: 600,
            location: {
              type: 'Point',
              coordinates: [1.777312, 41.259187],
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
                  ownerId: 'essencefood.tech',
                  bio: false,
                  grade: 'A',
                  size: '3x2',
                },
              },
              {
                instance: {
                  category: 'food',
                  type: 'water',
                  bio: true,
                },
                quantity: 1,
              },
              {
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
                      },
                      note: '',
                    },
                    timestamp: 1696457437,
                    duration: 1200,
                    location: {
                      type: 'Point',
                      coordinates: [-2.567003, 51.412577],
                    },

                    temperatureRange: {
                      min: -45,
                      max: 22,
                    },
                    inputInstances: [
                      {
                        transport: {
                          method: 'land',
                          fuelType: 'petrol',
                          weight: 0.0002,
                          deparetureTime: 1696453437,
                          duration: 21600,
                        },
                        quantity: 80,
                        instance: {
                          category: 'food',
                          type: 'strawberry_lyophilised',
                          iDs: {
                            registry: 'FDC',
                            id: 2344739,
                          },
                          ownerId: 'blendhub.com',
                          expiryDate: 1984317400,
                          format: 'powder',
                          bio: false,
                          grade: 'A',
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
                              },
                              note: {
                                'Particle size (micron)': 7,
                              },
                            },
                            timestamp: 1696449437,
                            duration: 360,
                            location: {
                              type: 'Point',
                              coordinates: [
                                10.252544038414928, 45.48027689773346,
                              ],
                            },

                            temperatureRange: {
                              min: -45,
                              max: 22,
                            },
                            inputInstances: [
                              {
                                transport: {
                                  method: 'sea',
                                  fuelType: 'diesel',
                                  weight: 0.00000004,
                                  deparetureTime: 1696400437,
                                  duration: 1036800,
                                },
                                quantity: 100,
                                instance:
                                  'https://api.gateway.ethswarm.org/bzz/30f5c5a8ad6f41784e5d11bb33b08730bf71a3cd6bb5d75e391ed62172cad78d/',
                              },
                              {
                                transport: {
                                  method: 'sea',
                                  fuelType: 'diesel',
                                  weight: 0.00000004,
                                  deparetureTime: 1696409437,
                                  duration: 1036800,
                                },
                                quantity: 300,
                                instance: {
                                  category: 'food',
                                  type: 'Mango_lyophilised',
                                  iDs: {
                                    registry: 'FDC',
                                    id: 2344738,
                                  },
                                  ownerId: 'essencefood.tech',
                                  expiryDate: 1759562637,
                                  format: 'slices',
                                  bio: false,
                                  grade: 'A',
                                  size: '1.5 cm',
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
                                      },
                                      note: 'Mango can be whole, or sliced/diced.',
                                    },
                                    timestamp: 1696389437,
                                    duration: 300,
                                    location: {
                                      type: 'Point',
                                      coordinates: [
                                        -48.3524439200693, -1.364037175459345,
                                      ],
                                    },
                                    temperatureRange: {
                                      min: -38,
                                      max: 57,
                                    },
                                    inputInstances: [
                                      {
                                        transport: {
                                          method: 'land',
                                          fuelType: 'diesel',
                                          weight: 1.0,
                                          deparetureTime: 1696349437,
                                          duration: 3600,
                                        },
                                        quantity: 2000,
                                        instance: {
                                          category: 'food',
                                          type: 'Mango',
                                          iDs: {
                                            registry: 'FDC',
                                            id: 2344737,
                                          },
                                          ownerId: 'essencefood.tech',
                                          expiryDate: 1696512237,
                                          format: 'whole',
                                          bio: false,
                                          grade: 'Ugly',
                                          size: '3 cm',
                                          process: {
                                            type: 'harvest',
                                            timestamp: 1696339437,
                                            location: {
                                              type: 'Point',
                                              coordinates: [
                                                -59.886277, -7.198175,
                                              ],
                                            },
                                            temperatureRange: {
                                              min: -45,
                                              max: 22,
                                            },
                                            inputInstances: [
                                              {
                                                instance: {
                                                  category: 'food',
                                                  type: 'Mango',
                                                  bio: true,
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
                      {
                        transport: {
                          method: 'sea',
                          fuelType: 'diesel',
                          weight: 0.00000004,
                          deparetureTime: 1684326200,
                          duration: 1036800,
                        },
                        instance: 'apiTest.json',
                        quantity: 150,
                      },
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
              // {
              //   type: 'transport',
              //   startTime: 1684318200,
              //   endTime: 1684317400,
              //   startGeo: {
              //     type: 'Feature',
              //     geometry: {
              //       type: 'Point',
              //       coordinates: {
              //         lat: 41.259187,
              //         long: 1.777312,
              //       },
              //     },
              //     properties: {},
              //   },
              //   endGeo: {
              //     type: 'Feature',
              //     geometry: {
              //       type: 'Point',
              //       coordinates: {
              //         lat: 41.259187,
              //         long: 1.777312,
              //       },
              //     },
              //     properties: {},
              //   },
              // },
            ],
          },
        },
      },
    ],
  },
};
