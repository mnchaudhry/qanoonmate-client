import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Gavel,
  Minimize2,
  Plus,
  FileText,
  Calendar,
} from "lucide-react";

const ChatRightbar = ({
  showContextPanel,
  setShowContextPanel,
  showDictionary,
  keyReferences = [],
  relatedCases = [],
  legalContext = null,
}: {
  showContextPanel: boolean;
  setShowContextPanel: (show: boolean) => void;
  showDictionary: boolean;
  setShowDictionary: (show: boolean) => void;
  keyReferences?: string[];
  relatedCases?: string[];
  legalContext?: string | null;
}) => {
  return (
    <>
      <div
        className={`
                    relative
                    h-screen
                    transition-all
                    duration-300
                    ease-in-out
                    overflow-y-auto
                    ${
                      showContextPanel
                        ? "w-[22rem] min-w-[22rem] max-w-[22rem] opacity-100 pointer-events-auto bg-surface border-l !border-border p-4 pt-8"
                        : "w-8 min-w-8 max-w-8 opacity-100 bg-surface border-l !border-border p-0"
                    }
                `}
        style={{
          // Prevent content interaction when closed
          pointerEvents: showContextPanel ? "auto" : "auto",
        }}
      >
        {showContextPanel ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Context & References
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContextPanel(false)}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Legal Context */}
            <Card className="py-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Legal Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {legalContext || "No legal context yet."}
                </p>
              </CardContent>
            </Card>

            {/* Key References */}
            <Card className="py-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Key References
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {keyReferences.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No references yet.
                  </div>
                )}
                {keyReferences.map((ref, idx) =>
                  typeof ref === "string" && ref ? (
                    <div
                      key={idx}
                      className="p-2 bg-primary/5 rounded border border-primary/10"
                    >
                      <p className="text-xs font-medium text-primary">
                        {ref}
                      </p>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="p-2 bg-primary/5 rounded border border-primary/10"
                    >
                      <p className="text-xs font-medium text-primary">
                        {String(ref)}
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Related Cases */}
            <Card className="py-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Related Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedCases.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No cases yet.
                  </div>
                )}
                {relatedCases.map((c, idx) => (
                  <div key={idx} className="p-2 bg-muted rounded text-xs">
                    <p className="font-medium">{c}</p>
                  </div>
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
        ) : (
          // The whole strip is clickable to open the panel
          <button
            type="button"
            aria-label="Open context panel"
            onClick={() => setShowContextPanel(true)}
            className={`
                            w-full h-full flex items-center justify-center
                            focus:outline-none
                            transition-colors duration-200
                            hover:bg-accent
                            group
                        `}
            style={{
              minHeight: "100vh",
            }}
          >
            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        )}
      </div>
    </>
  );
};

export default ChatRightbar;
