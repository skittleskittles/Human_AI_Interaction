export const globalState = {
  NUM_SELECTIONS: 2, // Maximum number of objects to select
  NUM_OBJECTS: 5, // Number of animated objects
  AI_HELP: 0,

  curTrial: 0,
  totalTrials: 3,

  randomGenerator: null, // Global variables for random generator (implements deterministic sequence that can be recreated in other languages)
  centerX: 0,
  centerY: 0,
  totalFrames: 0,
  animationFrameId: 0,
  animationStartTime: 0,
  objects: [], // Array to hold object properties
  selectedObjects: [], // Tracks selected objects for interception sequence
  hoverObjectIndex: -1, // Tracks which object is being hovered over
  speedMultiplier: 1, // Multiplier to adjust speed based on refresh rate

  player: {
    x0: 0,
    y0: 0,
    radius: 15,
    speed: 0,
    dX: 0,
    dY: 0,
    x: 0,
    y: 0,
  },

  permutations: [],
  allSolutions: null,
  bestSolution: null,
  playerSolution: null,
  interceptionCounter: 0,
  interceptionFrame: 0,

  canshowRequestAI: false,
};

/*
allSolutions = [
  {
    sequence: [...],       // 序列（对象的索引列表）
    totalValue: number,    // 该序列获得的总分数
    moves: [               // 追踪玩家的拦截行动
      {
        success: boolean,       // 该拦截是否成功
        value: number,          // 如果在圆内，拦截目标的得分
        timeToIntercept: number,// 需要的帧数
        dX: number,             // 玩家在 X 方向的移动速度
        dY: number,             // 玩家在 Y 方向的移动速度
        interceptPosX: number,  // 拦截点 X 坐标
        interceptPosY: number,  // 拦截点 Y 坐标
      },
      ...
    ]
  },
  ...
];*/
