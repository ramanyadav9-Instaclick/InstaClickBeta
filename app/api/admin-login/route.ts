import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { adminId, password } = await req.json();

    if (!adminId || !password) {
      return NextResponse.json(
        { success: false, error: 'User ID and Password are required' },
        { status: 400 }
      );
    }

    // Read environment variables at request time.
    // This prevents Supabase from being initialized during
    // the Next.js build process on GoDaddy.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables are missing');

      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    // Server-side master owner credentials
    // These MUST be configured in GoDaddy environment variables.
    const masterUser = process.env.ADMIN_MASTER_USER;
    const masterPass = process.env.ADMIN_MASTER_PASS;

    if (masterUser && masterPass) {
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
    }

    // Check team member in Supabase
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
  } catch (err) {
    console.error('Admin authentication error:', err);

    return NextResponse.json(
      { success: false, error: 'Server authentication error' },
      { status: 500 }
    );
  }
}