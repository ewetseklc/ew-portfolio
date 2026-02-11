import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Save, Shield } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Projects CRUD
  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const updateProject = useMutation({
    mutationFn: async (project: { id: string; title: string; description: string; tech_stack: string[]; github_url: string }) => {
      const { error } = await supabase.from("projects").update(project).eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Project updated" });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Project deleted" });
    },
  });

  // Exams CRUD
  const { data: exams } = useQuery({
    queryKey: ["admin-exams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exams").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const updateExam = useMutation({
    mutationFn: async (exam: { id: string; name: string; full_name: string; status: "Passed" | "Sitting" | "Future"; date: string }) => {
      const { error } = await supabase.from("exams").update(exam).eq("id", exam.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      toast({ title: "Exam updated" });
    },
  });

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass rounded-2xl p-8 w-full max-w-sm neon-glow">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-primary" />
            <h1 className="font-display font-bold text-xl">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/50" required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted/50" required />
            <Button type="submit" disabled={authLoading} className="w-full gradient-bg text-primary-foreground font-display font-bold">
              {authLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-strong sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <h1 className="font-display font-bold text-sm">EW Analytics Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={14} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Projects */}
        <section>
          <h2 className="font-display font-bold text-lg mb-4">Projects</h2>
          <div className="space-y-4">
            {projects?.map((p) => (
              <div key={p.id} className="glass rounded-xl p-4">
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <Input defaultValue={p.title} id={`title-${p.id}`} className="bg-muted/50 text-sm" placeholder="Title" />
                  <Input defaultValue={p.github_url || ""} id={`github-${p.id}`} className="bg-muted/50 text-sm" placeholder="GitHub URL" />
                </div>
                <Textarea defaultValue={p.description} id={`desc-${p.id}`} className="bg-muted/50 text-sm mb-3" placeholder="Description" />
                <Input defaultValue={p.tech_stack.join(", ")} id={`tech-${p.id}`} className="bg-muted/50 text-sm mb-3" placeholder="Tech stack (comma-separated)" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const title = (document.getElementById(`title-${p.id}`) as HTMLInputElement).value;
                      const description = (document.getElementById(`desc-${p.id}`) as HTMLTextAreaElement).value;
                      const github_url = (document.getElementById(`github-${p.id}`) as HTMLInputElement).value;
                      const tech_stack = (document.getElementById(`tech-${p.id}`) as HTMLInputElement).value.split(",").map((s) => s.trim()).filter(Boolean);
                      updateProject.mutate({ id: p.id, title, description, tech_stack, github_url });
                    }}
                    className="gradient-bg text-primary-foreground text-xs"
                  >
                    <Save size={12} className="mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteProject.mutate(p.id)} className="text-destructive text-xs">
                    <Trash2 size={12} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exams */}
        <section>
          <h2 className="font-display font-bold text-lg mb-4">Exams</h2>
          <div className="space-y-4">
            {exams?.map((exam) => (
              <div key={exam.id} className="glass rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Input defaultValue={exam.name} id={`ename-${exam.id}`} className="bg-muted/50 text-sm" placeholder="Name" />
                  <Input defaultValue={exam.full_name} id={`efull-${exam.id}`} className="bg-muted/50 text-sm" placeholder="Full Name" />
                  <select
                    defaultValue={exam.status}
                    id={`estatus-${exam.id}`}
                    className="bg-muted/50 border border-border rounded-md px-3 text-sm text-foreground"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Sitting">Sitting</option>
                    <option value="Future">Future</option>
                  </select>
                  <Input defaultValue={exam.date || ""} id={`edate-${exam.id}`} className="bg-muted/50 text-sm" placeholder="Date" />
                </div>
                <Button
                  size="sm"
                  className="mt-3 gradient-bg text-primary-foreground text-xs"
                  onClick={() => {
                    const name = (document.getElementById(`ename-${exam.id}`) as HTMLInputElement).value;
                    const full_name = (document.getElementById(`efull-${exam.id}`) as HTMLInputElement).value;
                    const status = (document.getElementById(`estatus-${exam.id}`) as HTMLSelectElement).value;
                    const date = (document.getElementById(`edate-${exam.id}`) as HTMLInputElement).value;
                    updateExam.mutate({ id: exam.id, name, full_name, status: status as "Passed" | "Sitting" | "Future", date });
                  }}
                >
                  <Save size={12} className="mr-1" /> Save
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
