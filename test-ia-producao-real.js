// Script para testar IA em produção com token real
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCkHVgsaIjwuggNKIv9rpa4M50ODyuy3L4",
  authDomain: "ordem-em-dia.firebaseapp.com",
  projectId: "ordem-em-dia",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

async function testIA() {
  try {
    // Login com usuário de teste
    const userCredential = await signInWithEmailAndPassword(auth, 'teste@konzup.com', '1q2w3e4r');
    const idToken = await userCredential.user.getIdToken();
    
    console.log('✅ Token obtido:', idToken.substring(0, 50) + '...');
    
    // Chamada à API
    const response = await fetch('https://konzup-hub-backend-336386698724.us-central1.run.app/api/ia/sugerir-resumo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo: 'atraso',
        descricao: 'voo atrasou 3 horas e passageiro perdeu conexão',
        prazoDias: 3
      })
    });
    
    const data = await response.json();
    
    console.log('\n=== RESPOSTA DA API ===');
    console.log('Status HTTP:', response.status);
    console.log('JSON:', JSON.stringify(data, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

testIA();
