import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Gavel,
  Minimize2,
  Plus,
  FileText,
  Calendar,
  Link,
} from "lucide-react";
import { RightbarSkeleton } from "@/components/skeletons/RightbarSkeleton";

interface ChatRightbarProps {
  showContextPanel: boolean;
  setShowContextPanel: (show: boolean) => void;
  showDictionary: boolean;
  setShowDictionary: (show: boolean) => void;
  keyReferences?: string[];
  relatedCases?: string[];
  referencedLinks?: string[];
  legalContext?: string | null;
  isLoading?: boolean;
}

const ChatRightbar: React.FC<ChatRightbarProps> = ({
  showContextPanel,
  setShowContextPanel,
  showDictionary,
  keyReferences = [],
  relatedCases = [],
  legalContext = null,
  referencedLinks = [],
  isLoading = false,
}) => {
  return (
    <>
      {/* Desktop / Tablet docked rightbar */}
      <div
        className={`hidden md:block relative h-screen transition-all duration-300 ease-in-out overflow-y-auto 
          ${
            showContextPanel
              ? "w-[22rem] min-w-[22rem] max-w-[22rem] opacity-100 pointer-events-auto bg-surface border-l border-border p-4 pt-8 shadow-inner"
              : "w-8 min-w-8 max-w-8 opacity-100 bg-surface border-l border-border p-0"
          }`}
        style={{ pointerEvents: showContextPanel ? "auto" : "auto" }}
      >
        {showContextPanel ? (
          isLoading ? (
            <RightbarSkeleton />
          ) : (
            <div className="space-y-4 overflow-y-auto pb-16">
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-surface z-10 pb-3 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-primary" />
                  Context & References
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContextPanel(false)}
                  className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Legal Context */}
              <Card className="py-0 border-primary/20 hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                    <Gavel className="w-4 h-4 text-primary" />
                    Legal Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {legalContext ||
                      "No legal context available yet. Start chatting to see relevant legal context."}
                  </p>
                </CardContent>
              </Card>

              {/* Key References */}
              <Card className="py-0 overflow-y-auto max-h-64 border-primary/20 hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3 sticky top-0 bg-background z-10">
                  <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                    <FileText className="w-4 h-4 text-primary" />
                    Key References
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {keyReferences.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No references yet. References will appear here as you
                      chat.
                    </div>
                  )}
                  {keyReferences.map((ref, idx) =>
                    typeof ref === "string" && ref ? (
                      <div
                        key={idx}
                        className="p-3 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-200 hover:shadow-sm"
                      >
                        <p className="text-xs font-medium text-primary leading-relaxed">
                          {ref}
                        </p>
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="p-3 bg-primary/5 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-200 hover:shadow-sm"
                      >
                        <p className="text-xs font-medium text-primary leading-relaxed">
                          {String(ref)}
                        </p>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>

              {/* Related Cases */}
              <Card className="py-0 border-primary/20 hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-primary" />
                    Related Cases
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {relatedCases.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No cases yet. Related case law will appear here.
                    </div>
                  )}
                  {relatedCases.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted rounded-lg text-xs hover:bg-muted/80 transition-all duration-200 hover:shadow-sm"
                    >
                      <p className="font-medium leading-relaxed">{c}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/** Referenced links */}
              <Card className="py-0 overflow-y-auto max-h-64 border-primary/20 hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3 sticky top-0 bg-background z-10">
                  <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                    <Link className="w-4 h-4 text-primary" />
                    Referenced Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 overflow-x-auto">
                  {referencedLinks.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No referenced links yet. External links will appear here.
                    </div>
                  )}
                  {referencedLinks.map((c, idx) => (
                    <a
                      key={idx}
                      href={c}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-muted rounded-lg text-xs hover:bg-muted/70 transition-all duration-200 hover:shadow-sm group"
                    >
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {c}
                      </p>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Legal Dictionary */}
              {showDictionary && (
                <Card className="py-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Legal Dictionary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-2 bg-muted rounded text-xs">
                      <p className="font-medium">Eviction Notice</p>
                      <p className="text-muted-foreground mt-1">
                        Written notice required before eviction
                      </p>
                    </div>
                    <div className="p-2 bg-muted rounded text-xs">
                      <p className="font-medium">Tenant Rights</p>
                      <p className="text-muted-foreground mt-1">
                        Legal protections for renters
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        ) : (
          <button
            type="button"
            aria-label="Open context panel"
            onClick={() => setShowContextPanel(true)}
            className={`min-h-screen w-full h-full flex items-center justify-center focus:outline-none transition-all duration-200 hover:bg-accent/50 group`}
          >
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110" />
          </button>
        )}
      </div>

      {/* Mobile overlay rightbar */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-40 bg-surface border-l border-border w-[90%] max-w-[22rem] transform transition-transform duration-300 ease-out shadow-2xl ${
          showContextPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 pt-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border sticky top-0 bg-surface z-10">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              Context & References
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContextPanel(false)}
              className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Legal Context */}
          <Card className="py-0 mb-3 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <Gavel className="w-4 h-4 text-primary" />
                Legal Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {legalContext || "No legal context available yet."}
              </p>
            </CardContent>
          </Card>

          {/* Key References */}
          <Card className="py-0 overflow-y-auto max-h-64 mb-3 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <FileText className="w-4 h-4 text-primary" />
                Key References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {keyReferences.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No references yet.
                </div>
              )}
              {keyReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                >
                  <p className="text-xs font-medium text-primary leading-relaxed">
                    {typeof ref === "string" && ref ? ref : String(ref)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Related Cases */}
          <Card className="py-0 mb-3 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4 text-primary" />
                Related Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedCases.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No cases yet.
                </div>
              )}
              {relatedCases.map((c, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg text-xs">
                  <p className="font-medium leading-relaxed">{c}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Referenced links */}
          <Card className="py-0 overflow-y-auto max-h-64 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <Link className="w-4 h-4 text-primary" />
                Referenced Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 overflow-x-auto">
              {referencedLinks.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No referenced links yet.
                </div>
              )}
              {referencedLinks.map((c, idx) => (
                <a
                  key={idx}
                  href={c}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-muted rounded-lg text-xs group"
                >
                  <p className="font-medium truncate group-hover:text-primary transition-colors">
                    {c}
                  </p>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ChatRightbar;
