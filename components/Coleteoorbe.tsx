import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, Animated } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 50;
const OBSTACLE_SIZE = 70; // tamanho do quadrado vermelho
const OBSTACLE_SPEED = 3; // velocidade do movimento horizontal

type JogoProps = {
  tempoLimite: number;
  onGameOver: (score: number) => void;
  dificuldade: "facil" | "medio" | "dificil";
};

function GameContent({ tempoLimite, onGameOver, dificuldade }: JogoProps) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [playerPosition, setPlayerPosition] = useState({ x: width / 2, y: height -150 });
  const [score, setScore] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(tempoLimite);
  const [som, setSom] = useState<Audio.Sound | null>(null);
  const [orbOpacity] = useState(new Animated.Value(1));
  const [orbColor, setOrbColor] = useState('#abd9f8ff');
  const [gameOverCalled, setGameOverCalled] = useState(false)

  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Paleta de cores do orbe
  const orbColors = ['#abd9f8ff', '#f39c12', '#e74c3c', '#2ecc71', '#9b59b6'];

  // Definir tamanho inicial do orbe por dificuldade
  const ORB_SIZE_MAP = {
    facil: 30,
    medio: 20,
    dificil: 12,
  };
  const [orbSize] = useState(ORB_SIZE_MAP[dificuldade]);

  // Gera posição respeitando safe area
  const generateRandomPosition = (
    insets: { top: number; bottom: number; left: number; right: number },
    orbSize: number
  ) => {
    const padding = 50;
    const safeWidth = width - insets.left - insets.right - orbSize - padding * 2;
    const safeHeight = height - insets.top - insets.bottom - orbSize - padding * 2;

    return {
      x: insets.left + padding + Math.random() * safeWidth,
      y: insets.top + padding + Math.random() * safeHeight,
    };
  };

  const [orbPosition, setOrbPosition] = useState(() =>
    generateRandomPosition(insets, ORB_SIZE_MAP[dificuldade])
  );

  // Obstáculo no meio da tela
  const [obstacleX, setObstacleX] = useState(width / 2 - OBSTACLE_SIZE / 2);
  const [obstacleDir, setObstacleDir] = useState(1);

  // Carrega o som do orbe
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/som.mp3'));
      setSom(sound);
    };
    loadSound();
    return () => { som?.unloadAsync(); };
  }, []);

  // Giroscópio
  useEffect(() => {
    Gyroscope.setUpdateInterval(45);
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
    });
    return () => subscription.remove();
  }, []);

  //movimento do player
  useEffect(() => {
  const DEADZONE = 0.01; // ignora movimentos muito pequenos
  const SCALE = 200;      // fator de multiplicação alto para tornar responsivo
  const SMOOTHING = 0.3;  // suaviza movimento

  // horizontal: y do giroscópio
  let deltaX = Math.abs(data.y) > DEADZONE ? data.y * SCALE : 0;
  // vertical: x do giroscópio, sem inverter
  let deltaY = Math.abs(data.x) > DEADZONE ? data.x * SCALE : 0;

  let targetX = playerPosition.x + deltaX;
  let targetY = playerPosition.y + deltaY;

  // limites da tela
  if (targetX < 0) targetX = 0;
  if (targetX > width - PLAYER_SIZE) targetX = width - PLAYER_SIZE;
  if (targetY < insets.top) targetY = insets.top;
  if (targetY > height - insets.bottom - PLAYER_SIZE) targetY = height - insets.bottom - PLAYER_SIZE;

  // aplica suavização
  setPlayerPosition(prev => ({
    x: prev.x + (targetX - prev.x) * SMOOTHING,
    y: prev.y + (targetY - prev.y) * SMOOTHING,
  }));
}, [data]);

  // Movimento do obstáculo
  useEffect(() => {
    const interval = setInterval(() => {
      setObstacleX(prev => {
        let next = prev + OBSTACLE_SPEED * obstacleDir;

        // se bater nos limites, corrige next e inverte direção
        if (next <= 0) {
          next = 0;
          setObstacleDir(1);
        } else if (next >= width - OBSTACLE_SIZE) {
          next = width - OBSTACLE_SIZE;
          setObstacleDir(-1);
        }

        return next;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [obstacleDir]);

  // Colisão player-orbe
  useEffect(() => {
    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + orbSize / 2;
    const orbCenterY = orbPosition.y + orbSize / 2;

    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (PLAYER_SIZE / 2) + (orbSize / 2)) {
      setScore(prev => prev + 1);
      setOrbPosition(generateRandomPosition(insets, orbSize));
      setOrbColor(orbColors[Math.floor(Math.random() * orbColors.length)]); // muda cor

      Animated.sequence([
        Animated.timing(orbOpacity, { toValue: 0.2, duration: 100, useNativeDriver: true }),
        Animated.timing(orbOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      som?.replayAsync();
    }
  }, [playerPosition]);

  // Colisão com obstáculo
  useEffect(() => {
    const playerRect = {
      x1: playerPosition.x,
      y1: playerPosition.y,
      x2: playerPosition.x + PLAYER_SIZE,
      y2: playerPosition.y + PLAYER_SIZE,
    };

    const obstacleRect = {
      x1: obstacleX,
      y1: height / 2 - OBSTACLE_SIZE / 2,
      x2: obstacleX + OBSTACLE_SIZE,
      y2: height / 2 + OBSTACLE_SIZE / 2,
    };

    if (
      playerRect.x1 < obstacleRect.x2 &&
      playerRect.x2 > obstacleRect.x1 &&
      playerRect.y1 < obstacleRect.y2 &&
      playerRect.y2 > obstacleRect.y1
    ) {
      if (!gameOverCalled) {
        setGameOverCalled(true);
        setTimeout(() => onGameOver(scoreRef.current));
      }
    }
  }, [playerPosition, obstacleX]);

  // Timer regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante(t => {
        if (t <= 1) {
          clearInterval(timer);
          if (!gameOverCalled) {
            setGameOverCalled(true);
            setTimeout(() => onGameOver(scoreRef.current));
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.score, { top: insets.top + 10, right: 20 }]}> Score: {score}</Text>
        <Text style={[styles.info, { top: 80 }]}>Tempo: {tempoRestante}s</Text>

        {/* Orbe */}  
        <Animated.View
          style={[
            styles.orb,
            {
              left: orbPosition.x,
              top: orbPosition.y,
              width: orbSize,
              height: orbSize,
              borderRadius: orbSize / 2,
              opacity: orbOpacity,
              backgroundColor: orbColor,
            }
          ]}
        />

        {/* Obstáculo */}
        <View
          style={[
            styles.obstacle,
            {
              left: obstacleX,
              top: height / 2 - OBSTACLE_SIZE / 2,
              width: OBSTACLE_SIZE,
              height: OBSTACLE_SIZE,
            }
          ]}
        />

        {/* Player */}
        <View style={[styles.player, { left: playerPosition.x, top: playerPosition.y }]} />
      </View>
    </SafeAreaView>
  );
}

export default function Jogo(props: JogoProps) {
  return (
    <SafeAreaProvider>
      <GameContent {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, backgroundColor: '#2c3e50', justifyContent: "center", alignItems: "center" },
  score: { fontSize: 24, color: "#fff", marginTop: 10, position: 'absolute' },
  info: { position: 'absolute', left: 20, fontSize: 20, color: '#fff', fontWeight: 'bold' },
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, borderRadius: PLAYER_SIZE / 2, backgroundColor: '#034397ff', borderWidth: 2, borderColor: '#fff' },
  orb: { position: 'absolute', borderWidth: 2, borderColor: '#fff' },
  obstacle: { position: 'absolute', backgroundColor: 'red', borderWidth: 2, borderColor: '#fff' },
});
