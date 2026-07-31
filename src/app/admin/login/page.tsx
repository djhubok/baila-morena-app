'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Email o contraseña incorrectos.');
      return;
    }
    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.grain} />
      <form onSubmit={handleLogin} style={styles.box}>
        <div style={styles.dot} />
        <h1 style={styles.h1}>Acceso privado</h1>
        <p style={styles.p}>Ingresá con tu cuenta de administrador.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    background: '#0a0908',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5vw',
    fontFamily: 'var(--font-body, sans-serif)',
    position: 'relative',
  },
  grain: { position: 'fixed', inset: 0, opacity: 0.04, pointerEvents: 'none' },
  box: {
    width: '100%',
    maxWidth: 380,
    textAlign: 'center',
    background: 'rgba(255,255,255,.03)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 18,
    padding: '40px 32px',
    position: 'relative',
    zIndex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#FF6A00',
    boxShadow: '0 0 12px #FF6A00',
    margin: '0 auto 16px',
  },
  h1: {
    fontFamily: 'var(--font-display, sans-serif)',
    fontSize: 22,
    textTransform: 'uppercase',
    color: '#f5f1ea',
    marginBottom: 6,
  },
  p: { fontSize: 12.5, color: '#8a8378', marginBottom: 24 },
  input: {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    border: '1px solid #3a352f',
    background: 'rgba(255,255,255,.04)',
    color: '#f5f1ea',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 999,
    border: 'none',
    background: '#FF6A00',
    color: '#0a0908',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  error: { color: '#ff6b6b', fontSize: 12, marginTop: 12, fontFamily: 'monospace' },
};
