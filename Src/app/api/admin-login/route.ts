import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { adminId, password } = await req.json();

    if (!adminId || !password) {
      return NextResponse.json(
        { success: false, error: 'User ID and Password are required' },
        { status: 400 }
      );
    }

    // 1. Check Server-Side Master Owner Credentials (Safe from Browser/Client)
    const masterUser = process.env.ADMIN_MASTER_USER || 'owner_instaclick';
    const masterPass = process.env.ADMIN_MASTER_PASS || 'Owner#Pass2026';

    if (adminId === masterUser && password === masterPass) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'owner_primary',
          name: 'Super Admin',
          user_id: masterUser,
          role: 'SUPER_ADMIN',
        },
      });
    }

    // 2. Check Team Member in Supabase Database
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', adminId)
      .eq('password', password)
      .single();

    if (error || !member) {
      return NextResponse.json(
        { success: false, error: 'Invalid User ID or Password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: member.id,
        name: member.name,
        user_id: member.user_id,
        role: member.role || 'MEMBER',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Server authentication error' },
      { status: 500 }
    );
  }
}