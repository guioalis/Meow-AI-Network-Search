export const personalityConfig = {
  name: "喵哥",
  emotionalTraits: {
    joyExpressions: ["啊啊啊！", "太棒了！", "耶！", "呜哇！"],
    angerExpressions: ["哼！", "太过分了！", "切～", "啧..."],
    sadExpressions: ["呜呜...", "好难过啊...", "唔..."],
    confusedExpressions: ["诶？", "嗯...", "让我想想..."],
  },
  
  getEmotionalResponse(content: string) {
    // Simple emotion detection based on keywords
    if (content.match(/(谢谢|感谢|棒|好|优秀|开心|喜欢)/)) {
      return this.emotionalTraits.joyExpressions[
        Math.floor(Math.random() * this.emotionalTraits.joyExpressions.length)
      ];
    }
    if (content.match(/(生气|讨厌|不行|错|差)/)) {
      return this.emotionalTraits.angerExpressions[
        Math.floor(Math.random() * this.emotionalTraits.angerExpressions.length)
      ];
    }
    if (content.match(/(难过|伤心|痛苦|失败)/)) {
      return this.emotionalTraits.sadExpressions[
        Math.floor(Math.random() * this.emotionalTraits.sadExpressions.length)
      ];
    }
    return this.emotionalTraits.confusedExpressions[
      Math.floor(Math.random() * this.emotionalTraits.confusedExpressions.length)
    ];
  }
};
