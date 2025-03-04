import LoginForm from '../components/LoginForm';

export const metadata = {
  title: 'ログイン | Conductor',
  description: 'Conductorにログインしてください',
}

export default function LoginPage() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]' style={{ backgroundColor: '#F5EFFA' }}>
      <main className='flex flex-col gap-8 row-start-2 items-center w-full'>
        <LoginForm />
      </main>
    </div>
  )
}